import { Signer, TezosToolkit, WalletProvider } from "@taquito/taquito";
import { Chain } from "../types/chain";
import { Progress } from "../types/progress";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";
declare type TezosSigner = WalletProvider | Signer;
/**
 * Creates a TezosToolkit instance with the giver signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer the corresponding signer (wallet or inMemorySigner)
 * @returns The TezosToolkit instance
 */
export declare function setChainSignerTezos(chain: Chain, signer: TezosSigner): TezosToolkit;
/**
 * Approves and locks at the same time a token on a Tezos network.
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param setProgress optional callback to track the progress
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
export declare function approveAndLockTezos(token: Token, destinationAddress: string, Tezos: TezosToolkit, setProgress: (progress: Progress) => void): Promise<number>;
/**
 * Wraps a token on a specific chain with proofs from the federation.
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
export declare function wrapTokenTezos(chain: Chain, message: UnsignedMessageType, signatures: Signature[], Tezos: TezosToolkit, setProgress: (progress: Progress) => void): Promise<WrappedTokenType>;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export declare function burnTokenTezos(token: Token, destinationAddress: string, Tezos: TezosToolkit, setProgress: (progress: Progress) => void): Promise<void>;
/**
 * Withdraws a token on a Tezos chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param Tezos The TezosToolkit instance
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export declare function withdrawTokenTezos(chain: Chain, message: UnsignedMessageType, signatures: Signature[], Tezos: TezosToolkit, setProgress: (progress: Progress) => void): Promise<void>;
export declare function getLockedTokenFromWrappedTezos(chain: Chain, wrappedId: number, Tezos: TezosToolkit): Promise<LockedTokenType>;
export {};
