import { Signer, TezosToolkit, WalletProvider } from "@taquito/taquito";
import { ChainConfig } from "../config";
import { Chain } from "../types/chain";
import { Token } from "../types/token";

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
 * @param Tezos The TezosToolkit instance corresponding to that chain
 * @param destinationAddress The addres on the target chain that will be receiving the token
 */
export function approveAndLockTezos(
    chain: Chain,
    token: Token,
    Tezos: TezosToolkit,
    destinationAddress: string
) {
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
                    .then((confirm) =>
                        confirm.completed
                            ? Date.parse(
                                  confirm.block.header.timestamp.toString()
                              )
                            : undefined
                    )
            );

    return Tezos.wallet.pkh().then(operation);
}
