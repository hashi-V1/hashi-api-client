import {
    approveAndLockEthereum,
    burnTokenEthereum,
    setChainSignerEthereum,
    withdrawTokenEthereum,
    wrapTokenEthereum,
} from "./chains/ethereum";
import {
    approveAndLockTezos,
    burnTokenTezos,
    setChainSignerTezos,
    withdrawTokenTezos,
    wrapTokenTezos,
} from "./chains/tezos";
import { proveTokenStatus } from "./prover";
import { Chain } from "./types/chain";
import { Signature, Status, UnsignedMessageType } from "./types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "./types/token";

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
        let instance: any;
        switch (chain) {
            case Chain.Tezos:
                instance = setChainSignerTezos(chain, signer);
                break;
            case Chain.Ethereum:
                instance = setChainSignerEthereum(chain, signer);
                break;
        }
        this.chainsInstances.set(chain, instance);
    }

    /**
     * Approves and locks at the same time a token.
     * @param chain The token's current chain.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     */
    approveAndLock(
        chain: Chain,
        token: Token,
        destinationAddress: string
    ): Promise<LockedTokenType> {
        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(
                "Signer has not been defined for this chain."
            );
        }

        let timestampedPromise: Promise<number>;
        switch (chain) {
            case Chain.Tezos:
                timestampedPromise = approveAndLockTezos(
                    chain,
                    token,
                    destinationAddress,
                    instance
                );
                break;

            case Chain.Ethereum:
                timestampedPromise = approveAndLockEthereum(
                    chain,
                    token,
                    destinationAddress,
                    instance
                );
                break;
        }

        return timestampedPromise.then((timestamp) => ({
            tokenContract: token.tokenContract,
            tokenId: token.tokenId,
            timestamp,
        }));
    }

    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @returns a promise with a Wrapped token
     */
    wrapToken(
        chain: Chain,
        message: UnsignedMessageType,
        signatures: Signature[]
    ): Promise<WrappedTokenType> {
        if (message.status !== Status.Locked) {
            return Promise.reject("Cannot wrap with status other than locked");
        }

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(
                "Signer has not been defined for this chain."
            );
        }

        switch (chain) {
            case Chain.Tezos:
                return wrapTokenTezos(chain, message, signatures, instance);

            case Chain.Ethereum:
                return wrapTokenEthereum(chain, message, signatures, instance);
        }
    }

    /**
     * Bridges (transfers) a token from one chain to another
     * @param sourceChain The token's current chain
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @returns a promise with the wrapped token
     */
    bridge(
        sourceChain: Chain,
        targetChain: Chain,
        token: Token,
        destinationAddress: string
    ): Promise<WrappedTokenType> {
        return this.approveAndLock(sourceChain, token, destinationAddress)
            .then((lockedToken) =>
                this.proveTokenStatus(
                    sourceChain,
                    targetChain,
                    lockedToken,
                    Status.Locked
                )
            )
            .then(({ signatures, message }) =>
                this.wrapToken(targetChain, message, signatures)
            );
    }

    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param sourceChain The token's current chain
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @returns an empty promise
     */
    unbridge(
        sourceChain: Chain,
        targetChain: Chain,
        token: LockedTokenType,
        destinationAddress: string
    ): Promise<void> {
        return this.burnToken(sourceChain, token, destinationAddress)
            .then(() =>
                this.proveTokenStatus(
                    sourceChain,
                    targetChain,
                    token,
                    Status.Burned
                )
            )
            .then(({ signatures, message }) =>
                this.withdrawToken(targetChain, message, signatures)
            );
    }

    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    proveTokenStatus(
        sourceChain: Chain,
        targetChain: Chain,
        token: LockedTokenType,
        status: Status
    ) {
        return proveTokenStatus(sourceChain, targetChain, token, status);
    }

    /**
     * Burn a wrapped token to transfer it to another chain
     * @param chain The chain where the token is currently wrapped
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @returns an empty promise
     */
    burnToken(
        chain: Chain,
        token: LockedTokenType,
        destinationAddress: string
    ): Promise<void> {
        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(
                "Signer has not been defined for this chain."
            );
        }

        switch (chain) {
            case Chain.Tezos:
                return burnTokenTezos(
                    chain,
                    token,
                    destinationAddress,
                    instance
                );

            case Chain.Ethereum:
                return burnTokenEthereum(
                    chain,
                    token,
                    destinationAddress,
                    instance
                );
        }
    }

    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @returns an empty promise
     */
    withdrawToken(
        chain: Chain,
        message: UnsignedMessageType,
        signatures: Signature[]
    ): Promise<void> {
        if (message.status !== Status.Burned) {
            return Promise.reject(
                "Cannot withdraw with status other than burned"
            );
        }

        const instance = this.chainsInstances.get(chain);
        if (typeof instance === "undefined") {
            return Promise.reject(
                "Signer has not been defined for this chain."
            );
        }

        switch (chain) {
            case Chain.Tezos:
                return withdrawTokenTezos(chain, message, signatures, instance);

            case Chain.Ethereum:
                return withdrawTokenEthereum(
                    chain,
                    message,
                    signatures,
                    instance
                );
        }
    }
}
