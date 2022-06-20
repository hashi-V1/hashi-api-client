import axios from "axios";
import {
    approveAndLockEthereum,
    burnTokenEthereum,
    getLockedTokenFromWrappedEthereum,
    setChainSignerEthereum,
    withdrawTokenEthereum,
    wrapTokenEthereum,
} from "./chains/ethereum";
import {
    approveAndLockTezos,
    burnTokenTezos,
    getLockedTokenFromWrappedTezos,
    setChainSignerTezos,
    withdrawTokenTezos,
    wrapTokenTezos,
} from "./chains/tezos";
import { hashiIndexerUrl } from "./config";
import { proveTokenStatus } from "./prover";
import {
    BridgeTransaction,
    TransactionReturn,
} from "./types/bridgeTransaction";
import { Chain } from "./types/chain";
import {
    CannotWithdrawWithStatusOtherThanBurned,
    CannotWrapWithStatusOtherThanLocked,
    EmptyDestinationAddressError,
    NoSignerForChainError,
    UnknownChain,
} from "./types/errors";
import { Progress } from "./types/progress";
import { Signature, Status, UnsignedMessageType } from "./types/proof";
import {
    isTokenWrapped,
    LockedTokenType,
    Token,
    tokenFromAddressAndId,
    WrappedTokenType,
} from "./types/token";
import { isMillisTimestamp, setProgressCallback } from "./utils";

/**
 * Main class of the Hashi Protocol bridge.
 */
export class HashiBridge {
    /**
     * Map containing instances for each chain.
     */
    private chainsInstances: Map<Chain, any>;

    /**
     * Constructor
     */
    constructor() {
        this.chainsInstances = new Map<Chain, any>();
    }

    /**
     * Saves the signer to use for a chain.
     * @param chain The signer's chain
     * @param signer The corresponding signer
     */
    setChainSigner(chain: Chain, signer: any) {
        let setter;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            setter = setChainSignerTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            setter = setChainSignerEthereum;
        if (!setter) throw new Error("Unknown chain");

        this.chainsInstances.set(chain, setter(chain, signer));
    }

    /**
     * Approves and locks at the same time a token.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     * @param progressCallback optional callback to track the progress
     */
    async approveAndLock(
        token: Token,
        destinationAddress: string,
        destinationChain: Chain,
        progressCallback?: (progress: Progress) => void
    ): Promise<TransactionReturn<LockedTokenType>> {
        const chain = token.chain;
        if (destinationAddress === "")
            return Promise.reject(EmptyDestinationAddressError);

        const setProgress = setProgressCallback(progressCallback);
        setProgress(Progress.ApprovingAndLocking);

        let approveAndLock;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            approveAndLock = approveAndLockTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            approveAndLock = approveAndLockEthereum;
        if (!approveAndLock) return Promise.reject(UnknownChain);

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined")
            return Promise.reject(NoSignerForChainError);

        const { hashes, data: timestamp } = await approveAndLock(
            token,
            destinationAddress,
            destinationChain,
            instance,
            setProgress
        );
        if (!isMillisTimestamp(timestamp))
            console.log(
                "DEBUG: Probable wrong timestamp (should be using milliseconds)"
            );

        setProgress(Progress.ApprovedAndLocked);
        return {
            hashes,
            data: {
                tokenContract: token.tokenContract,
                tokenId: token.tokenId,
                timestamp: timestamp,
            },
        };
    }

    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @param progressCallback optional callback to track the progress
     * @returns a promise with a Wrapped token
     */
    async wrapToken(
        chain: Chain,
        message: UnsignedMessageType,
        signatures: Signature[],
        progressCallback?: (progress: Progress) => void
    ): Promise<TransactionReturn<WrappedTokenType>> {
        if (message.status !== Status.Locked)
            return Promise.reject(CannotWrapWithStatusOtherThanLocked);

        const setProgress = setProgressCallback(progressCallback);
        setProgress(Progress.Wrapping);

        let wrapToken;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            wrapToken = wrapTokenTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            wrapToken = wrapTokenEthereum;
        if (!wrapToken) return Promise.reject(UnknownChain);

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined")
            return Promise.reject(NoSignerForChainError);

        const ret = await wrapToken(
            chain,
            message,
            signatures,
            instance,
            setProgress
        );

        setProgress(Progress.Wrapped);
        return ret;
    }

    /**
     * Bridges (transfers) a token from one chain to another
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @param progressCallback optional callback to track the progress
     * @returns a promise with the wrapped token
     */
    async bridge(
        targetChain: Chain,
        token: Token,
        destinationAddress: string,
        progressCallback?: (progress: Progress) => void
    ): Promise<BridgeTransaction> {
        if (isTokenWrapped(token.tokenContract, token.chain))
            return this.unbridge(
                targetChain,
                token,
                destinationAddress,
                progressCallback
            );

        if (destinationAddress === "")
            return Promise.reject(EmptyDestinationAddressError);

        const { hashes: hashes1, data: lockedToken } =
            await this.approveAndLock(
                token,
                destinationAddress,
                targetChain,
                progressCallback
            );
        const { signatures, message } = await this.proveTokenStatus(
            token.chain,
            targetChain,
            lockedToken,
            Status.Locked,
            progressCallback
        );

        const { hashes: hashes2, data: wrapped } = await this.wrapToken(
            targetChain,
            message,
            signatures,
            progressCallback
        );

        return {
            newToken: tokenFromAddressAndId(
                wrapped.tokenContract,
                wrapped.tokenId,
                wrapped.chain
            ),
            hashes: hashes1.concat(hashes2),
        };
    }

    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    async unbridge(
        targetChain: Chain,
        token: Token,
        destinationAddress: string,
        progressCallback?: (progress: Progress) => void
    ): Promise<BridgeTransaction> {
        if (destinationAddress === "")
            return Promise.reject(EmptyDestinationAddressError);

        const { hashes: hashes1 } = await this.burnToken(
            token,
            destinationAddress,
            progressCallback
        );

        const lockedToken = await this.getLockedTokenFromWrapped(token);
        const { signatures, message } = await this.proveTokenStatus(
            token.chain,
            targetChain,
            lockedToken,
            Status.Burned,
            progressCallback
        );

        const { hashes: hashes2 } = await this.withdrawToken(
            targetChain,
            message,
            signatures,
            progressCallback
        );

        return {
            newToken: tokenFromAddressAndId(
                lockedToken.tokenContract,
                lockedToken.tokenId,
                targetChain
            ),
            hashes: hashes1.concat(hashes2),
        };
    }

    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @param progressCallback optional callback to track the progress
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    async proveTokenStatus(
        sourceChain: Chain,
        targetChain: Chain,
        token: LockedTokenType,
        status: Status,
        progressCallback?: (progress: Progress) => void
    ): Promise<{ signatures: Signature[]; message: UnsignedMessageType }> {
        const setProgress = setProgressCallback(progressCallback);
        setProgress(Progress.ProvingStatus);

        const value = await proveTokenStatus(
            sourceChain,
            targetChain,
            token,
            status,
            setProgress
        );

        setProgress(Progress.ProvedStatus);
        return value;
    }

    /**
     * Burn a wrapped token to transfer it to another chain
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    async burnToken(
        token: Token,
        destinationAddress: string,
        progressCallback?: (progress: Progress) => void
    ): Promise<TransactionReturn<void>> {
        const chain = token.chain;
        if (destinationAddress === "")
            return Promise.reject(EmptyDestinationAddressError);

        const setProgress = setProgressCallback(progressCallback);
        setProgress(Progress.Burning);

        let burnToken;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            burnToken = burnTokenTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            burnToken = burnTokenEthereum;
        if (!burnToken) return Promise.reject(UnknownChain);

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined")
            return Promise.reject(NoSignerForChainError);

        const ret = await burnToken(
            token,
            destinationAddress,
            instance,
            setProgress
        );

        setProgress(Progress.Burned);

        return ret;
    }

    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    async withdrawToken(
        chain: Chain,
        message: UnsignedMessageType,
        signatures: Signature[],
        progressCallback?: (progress: Progress) => void
    ): Promise<TransactionReturn<void>> {
        if (message.status !== Status.Burned)
            return Promise.reject(CannotWithdrawWithStatusOtherThanBurned);

        const setProgress = setProgressCallback(progressCallback);
        setProgress(Progress.Withdrawing);

        let withdrawToken;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            withdrawToken = withdrawTokenTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            withdrawToken = withdrawTokenEthereum;
        if (!withdrawToken) return Promise.reject(UnknownChain);

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined")
            return Promise.reject(NoSignerForChainError);

        const ret = await withdrawToken(
            chain,
            message,
            signatures,
            instance,
            setProgress
        );
        setProgress(Progress.Withdrawed);

        return ret;
    }

    async getLockedTokenFromWrapped(wrapped: Token): Promise<LockedTokenType> {
        const chain = wrapped.chain;

        if (!isTokenWrapped(wrapped.tokenContract, chain))
            return Promise.reject("Token is not wrapped");

        let getLocked;
        if (chain === Chain.Tezos || chain === Chain.Ithacanet)
            getLocked = getLockedTokenFromWrappedTezos;
        else if (chain === Chain.Ethereum || chain === Chain.Ropsten)
            getLocked = getLockedTokenFromWrappedEthereum;
        if (!getLocked) return Promise.reject(UnknownChain);

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(NoSignerForChainError);
        }

        const locked = await getLocked(chain, wrapped.tokenId, instance);
        if (!isMillisTimestamp(locked.timestamp))
            console.log(
                "DEBUG: Probable wrong timestamp (should be using milliseconds)"
            );

        return locked;
    }

    async getTokensForAccount(chain: Chain, address: string): Promise<Token[]> {
        if (!hashiIndexerUrl) return [];

        try {
            const response = await axios.get(
                `${hashiIndexerUrl}/nftsForAccount`,
                {
                    params: {
                        chain,
                        address,
                    },
                }
            );

            if (response.status !== 200) return Promise.reject(response.data);

            if (!response.data || !Array.isArray(response.data.data))
                throw new Error(); // Indexer Error

            return response.data.data;
        } catch (e) {
            return Promise.reject("Indexer error");
        }
    }
}
