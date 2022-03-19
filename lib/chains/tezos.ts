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
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param setProgress optional callback to track the progress
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
export function approveAndLockTezos(
    token: Token,
    destinationAddress: string,
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<number> {
    const operation = (signerAddress: string) =>
        Tezos.wallet
            .at(chainConfig[token.chain].lockerContract)
            .then((lockerContract) =>
                Tezos.wallet
                    .at(token.tokenContract)
                    .then((tokenContract) => {
                        setProgress(Progress.WaitingForUserApproval);
                        setProgress(Progress.WaitingForUserLock);

                        return Tezos.wallet
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
                                    token_address: token.tokenContract,
                                    token_id: token.tokenId.toString(),
                                })
                            )
                            .send();
                    })
                    .then((op) => {
                        setProgress(Progress.WaitingForConfirmationApproval);
                        setProgress(Progress.WaitingForConfirmationLock);

                        return op.confirmation();
                    })
                    .then((confirm) => {
                        if (!confirm.completed) {
                            return Promise.reject("Transaction not completed");
                        }

                        return Date.parse(
                            confirm.block.header.timestamp.toString()
                        );
                    })
            );

    return Tezos.wallet.pkh().then(operation);
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
export function wrapTokenTezos(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<WrappedTokenType> {
    return Tezos.wallet
        .at(chainConfig[chain].wrapperContract)
        .then((wrapperContract) => {
            setProgress(Progress.WaitingForUserWrap);
            return wrapperContract.methodsObject
                .wrap({
                    token_contract: message.tokenContract,
                    token_id: message.tokenId.toString(),
                    lock_timestamp: new Date(message.timestamp).toISOString(),
                    token_metadata: stringToHex(message.metadata),
                    signatures: signatureArrayToMichelsonMap(signatures),
                })
                .send()
                .then((op) => {
                    setProgress(Progress.WaitingForConfirmationWrap);
                    return op.confirmation();
                })
                .then((confirm) => {
                    if (!confirm.completed) {
                        return Promise.reject("Transaction not completed");
                    }

                    return wrapperContract.storage().then((wrapperStorage) => {
                        if (
                            wrapperStorage === null ||
                            typeof wrapperStorage !== "object" ||
                            !hasOwnProperty(wrapperStorage, "wrapped_tokens") ||
                            !MichelsonMap.isMichelsonMap(
                                wrapperStorage.wrapped_tokens
                            )
                        ) {
                            return Promise.reject("Invalid wrapper storage");
                        }

                        const tid = parseInt(
                            wrapperStorage.wrapped_tokens.get({
                                token_contract: message.tokenContract,
                                token_id: message.tokenId.toString(),
                            })
                        );

                        if (isNaN(tid)) {
                            return Promise.reject(
                                "Could not retrieve wrapped token id"
                            );
                        }

                        return tid;
                    });
                });
        })
        .then((tokenId) => ({
            tokenContract: chainConfig[chain].wrapperContract,
            tokenId,
            chain: chain,
        }));
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
export function burnTokenTezos(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<void> {
    return Tezos.wallet
        .at(chainConfig[chain].wrapperContract)
        .then((wrapperContract) => {
            setProgress(Progress.WaitingForUserBurn);
            return wrapperContract.methodsObject
                .burn({
                    destination_address: destinationAddress,
                    lock_timestamp: token.timestamp.toString(),
                    token_contract: token.tokenContract,
                    token_id: token.tokenId.toString(),
                })
                .send();
        })
        .then((op) => {
            setProgress(Progress.WaitingForConfirmationBurn);
            return op.confirmation();
        })
        .then((confirm) => {
            if (!confirm.completed) return Promise.reject("could not burn");
        });
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
export function withdrawTokenTezos(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    Tezos: TezosToolkit,
    setProgress: (progress: Progress) => void
): Promise<void> {
    return Tezos.wallet
        .at(chainConfig[chain].lockerContract)
        .then((lockerContract) => {
            setProgress(Progress.WaitingForUserWithdraw);
            return lockerContract.methodsObject
                .withdraw({
                    token_address: message.tokenContract,
                    token_id: message.tokenId.toString(),
                    locked_timestamp: message.timestamp.toString(),
                    signatures: new MichelsonMap(),
                })
                .send();
        })
        .then((op) => {
            setProgress(Progress.WaitingForConfirmationWithdraw);
            return op.confirmation();
        })
        .then((confirm) => {
            if (!confirm.completed) return Promise.reject("could not withdraw");
        });
}

export function getLockedTokenTezos(
    wrapped: WrappedTokenType,
    Tezos: TezosToolkit
): Promise<LockedTokenType> {
    return Tezos.contract
        .at(wrapped.tokenContract)
        .then((wrapperContract) => wrapperContract.storage())
        .then((wrapperStorage) => {
            if (
                wrapperStorage === null ||
                typeof wrapperStorage !== "object" ||
                !hasOwnProperty(wrapperStorage, "wrapped_id") ||
                !MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_id)
            ) {
                return Promise.reject("Invalid wrapper storage.");
            }

            const r = wrapperStorage.wrapped_id.get(wrapped.tokenId.toString());

            if (
                r === null ||
                typeof r !== "object" ||
                !hasOwnProperty(r, "lock_timestamp") ||
                !hasOwnProperty(r, "token_contract") ||
                !hasOwnProperty(r, "token_id")
            ) {
                return Promise.reject("Could not retrieve wrapped token");
            }

            return {
                tokenId: r.token_id,
                tokenContract: r.token_contract,
                timestamp: r.lock_timestamp,
            };
        });
}
