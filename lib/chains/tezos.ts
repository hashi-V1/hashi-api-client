import {
    MichelsonMap,
    Signer,
    TezosToolkit,
    WalletProvider,
} from "@taquito/taquito";
import { ChainConfig } from "../config";
import { Chain } from "../types/chain";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";

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
    const Tezos = new TezosToolkit(ChainConfig[chain].rpc);
    if (tezosSignerIsWalletProvider(signer)) {
        Tezos.setWalletProvider(signer);
    } else {
        Tezos.setSignerProvider(signer);
    }
    return Tezos;
}

/**
 * Approves and locks at the same time a token on a Tezos network.
 * @param chain The token's current chain (used to know whether we are using a testnet or the mainnet)
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
export function approveAndLockTezos(
    chain: Chain,
    token: Token,
    destinationAddress: string,
    Tezos: TezosToolkit
): Promise<number> {
    const operation = (signerAddress: string) =>
        Tezos.wallet
            .at(ChainConfig[chain].lockerContract)
            .then((lockerContract) =>
                Tezos.wallet
                    .at(token.tokenContract)
                    .then((tokenContract) =>
                        Tezos.wallet
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
                            .send()
                    )
                    .then((op) => op.confirmation())
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
 * TODO: Get the wrapped token id from storage
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @returns a wrapped token
 */
export function wrapTokenTezos(
    chain: Chain,
    message: UnsignedMessageType,
    signatures: Signature[],
    Tezos: TezosToolkit
): Promise<WrappedTokenType> {
    return Tezos.wallet
        .at(ChainConfig[chain].wrapperContract)
        .then((wrapperContract) =>
            wrapperContract.methodsObject
                .wrap({
                    token_contract: message.tokenContract,
                    token_id: message.tokenId.toString(),
                    lock_timestamp: message.timestamp.toString(),
                    metadata: new MichelsonMap(),
                    signatures: new MichelsonMap(),
                })
                .send()
        )
        .then((op) => op.confirmation())
        .then((confirm) => ({
            tokenContract: ChainConfig[chain].wrapperContract,
            tokenId: 5,
            chain: chain,
        }));
}

/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @returns an empty promise
 */
export function burnTezos(
    chain: Chain,
    token: LockedTokenType,
    destinationAddress: string,
    Tezos: TezosToolkit
): Promise<void> {
    return Tezos.wallet
        .at(ChainConfig[chain].wrapperContract)
        .then((wrapperContract) =>
            wrapperContract.methodsObject
                .burn({
                    destination_address: destinationAddress,
                    lock_timestamp: token.timestamp.toString(),
                    token_contract: token.tokenContract,
                    token_id: token.tokenId.toString(),
                })
                .send()
        )
        .then((op) => op.confirmation())
        .then((confirm) => {
            if (!confirm.completed) return Promise.reject("could not burn");
        });
}
