import {
    MichelsonMap,
    Signer,
    TezosToolkit,
    WalletProvider,
} from "@taquito/taquito";
import { chainConfig } from "../config";
import { Chain } from "../types/chain";
import { Progress } from "../types/progress";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";
import { hasOwnProperty, stringToHex } from "../utils";

type TezosSigner = WalletProvider | Signer;

/**
 * Checks whether the TezosSigner is a WalletProvider instead of a Signer
 * @param signer a TezosSigner signer
 * @returns a boolean and a type predicate
 */
function tezosSignerIsWalletProvider(
    signer: TezosSigner
): signer is WalletProvider {
    return (
        typeof signer === "object" &&
        "getPKH" in signer &&
        "mapTransferParamsToWalletParams" in signer &&
        "mapOriginateParamsToWalletParams" in signer &&
        "mapDelegateParamsToWalletParams" in signer &&
        "sendOperations" in signer
    );
}

/**
 * Creates a TezosToolkit instance with the giver signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer the corresponding signer (wallet or inMemorySigner)
 * @returns The TezosToolkit instance
 */
export function setChainSignerTezos(chain: Chain, signer: TezosSigner) {
    const Tezos = new TezosToolkit(chainConfig[chain].rpc!);
    if (tezosSignerIsWalletProvider(signer)) {
        Tezos.setWalletProvider(signer);
    } else {
        Tezos.setSignerProvider(signer);
    }
    return Tezos;
}

/**
 * Convert an array of Signatures to a MichelsonMap
 * @param signatures an array of Signature(s)
 * @returns a MichelsonMap with the public key as key and sig as value
 */
function signatureArrayToMichelsonMap(signatures: Signature[]) {
    let map = new MichelsonMap<string, string>();
    signatures.forEach((signature) =>
        map.set(signature.publicKey, signature.sig)
    );
    return map;
}

/**
 * Approves and locks at the same time a token on a Tezos network.
 * TODO: get timestamp from storage
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param setProgress optional callback to track the progress
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
export async function approveAndLockTezos(
    token: Token,
    destinationAddress: string,
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<number> {
    const signerAddress = await Tezos.wallet.pkh();
    const lockerContract = await Tezos.wallet.at(
        chainConfig[token.chain].lockerContract
    );
    const tokenContract = await Tezos.wallet.at(token.tokenContract);

    setProgress(Progress.WaitingForUserApproval);
    setProgress(Progress.WaitingForUserLock);
    const operation = await Tezos.wallet
        .batch()
        .withContractCall(
            tokenContract.methods.update_operators([
                {
                    add_operator: {
                        owner: signerAddress,
                        operator: lockerContract.address,
                        token_id: token.tokenId,
                    },
                },
            ])
        )
        .withContractCall(
            lockerContract.methodsObject.lock({
                destination_address: destinationAddress,
                token_contract: token.tokenContract,
                token_id: token.tokenId.toString(),
            })
        )
        .send();

    setProgress(Progress.WaitingForConfirmationApproval);
    setProgress(Progress.WaitingForConfirmationLock);
    const confirmation = await operation.confirmation();

    if (!confirmation.completed)
        return Promise.reject("Transaction not completed");

    return Date.parse(confirmation.block.header.timestamp.toString());
}

/**
 * Wraps a token on a specific chain with proofs from the federation.
 * TODO: Signatures not recognized by contracts
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
export async function wrapTokenTezos(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<WrappedTokenType> {
    const wrapperContract = await Tezos.wallet.at(
        chainConfig[chain].wrapperContract
    );

    setProgress(Progress.WaitingForUserWrap);
    const operation = await wrapperContract.methodsObject
        .wrap({
            token_contract: message.tokenContract,
            token_id: message.tokenId.toString(),
            lock_timestamp: new Date(message.timestamp).toISOString(),
            token_metadata: stringToHex(message.metadata),
            signatures: signatureArrayToMichelsonMap(signatures),
        })
        .send();

    setProgress(Progress.WaitingForConfirmationWrap);
    const confirmation = await operation.confirmation();

    if (!confirmation.completed)
        return Promise.reject("Transaction not completed");

    const wrapperStorage = await wrapperContract.storage();

    if (
        wrapperStorage === null ||
        typeof wrapperStorage !== "object" ||
        !hasOwnProperty(wrapperStorage, "wrapped_tokens") ||
        !MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_tokens)
    )
        return Promise.reject("Invalid wrapper storage");

    const tokenId = parseInt(
        wrapperStorage.wrapped_tokens.get({
            token_contract: message.tokenContract,
            token_id: message.tokenId.toString(),
        })
    );

    if (isNaN(tokenId))
        return Promise.reject("Could not retrieve wrapped token id");

    return {
        tokenContract: chainConfig[chain].wrapperContract,
        tokenId,
        chain: chain,
    };
}

/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export async function burnTokenTezos(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const wrapperContract = await Tezos.wallet.at(
        chainConfig[chain].wrapperContract
    );

    setProgress(Progress.WaitingForUserBurn);
    const operation = await wrapperContract.methodsObject
        .burn({
            destination_address: destinationAddress,
            lock_timestamp: token.timestamp.toString(),
            token_contract: token.tokenContract,
            token_id: token.tokenId.toString(),
        })
        .send();

    setProgress(Progress.WaitingForConfirmationBurn);
    const confirmation = await operation.confirmation();

    if (!confirmation.completed) return Promise.reject("Could not burn");
}

/**
 * Withdraws a token on a Tezos chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param Tezos The TezosToolkit instance
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export async function withdrawTokenTezos(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<void> {
    const lockerContract = await Tezos.wallet.at(
        chainConfig[chain].lockerContract
    );

    setProgress(Progress.WaitingForUserWithdraw);
    const op = await lockerContract.methodsObject
        .withdraw({
            token_contract: message.tokenContract,
            token_id: message.tokenId.toString(),
            lock_timestamp: message.timestamp.toString(),
            signatures: new MichelsonMap(),
        })
        .send();

    setProgress(Progress.WaitingForConfirmationWithdraw);
    const confirm = await op.confirmation();

    if (!confirm.completed) return Promise.reject("Could not withdraw");
}

export async function getLockedTokenTezos(
    wrapped: WrappedTokenType,
    Tezos: TezosToolkit
): Promise<LockedTokenType> {
    const wrapperContract = await Tezos.contract.at(wrapped.tokenContract);
    const wrapperStorage = await wrapperContract.storage();

    if (
        wrapperStorage === null ||
        typeof wrapperStorage !== "object" ||
        !hasOwnProperty(wrapperStorage, "wrapped_id") ||
        !MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_id)
    )
        return Promise.reject("Invalid wrapper storage.");

    const value = wrapperStorage.wrapped_id.get(wrapped.tokenId.toString());
    if (
        value === null ||
        typeof value !== "object" ||
        !hasOwnProperty(value, "lock_timestamp") ||
        !hasOwnProperty(value, "token_contract") ||
        !hasOwnProperty(value, "token_id") ||
        isNaN(Number(value.token_id))
    )
        return Promise.reject("Could not retrieve wrapped token");

    return {
        tokenId: Number(value.token_id),
        tokenContract: value.token_contract,
        timestamp: value.lock_timestamp,
    };
}
