import { Signer } from "ethers";
import { TransactionReturn } from "../types/bridgeTransaction";
import { Chain } from "../types/chain";
import { Progress } from "../types/progress";
import { Signature, UnsignedMessageType } from "../types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../types/token";
/**
 * Sets the instance for the ethereum signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer The ethereum Signer (from ethers.js)
 * @returns The instance for this chain
 */
export declare function setChainSignerEthereum(chain: Chain, signer: Signer): Signer;
/**
 * Approves and locks at the same time a token on an Ethereum network.
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param destinationChain The target Chain
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a promise with the token's lock timestamp
 */
export declare function approveAndLockEthereum(token: Token, destinationAddress: string, destinationChain: Chain, signer: Signer, setProgress: (progress: Progress) => void): Promise<TransactionReturn<number>>;
/**
 * Wraps a token on a specific chain with proofs from the federation.
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
export declare function wrapTokenEthereum(chain: Chain, message: UnsignedMessageType, signatures: Signature[], signer: Signer, setProgress: (progress: Progress) => void): Promise<TransactionReturn<WrappedTokenType>>;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export declare function burnTokenEthereum(token: Token, destinationAddress: string, signer: Signer, setProgress: (progress: Progress) => void): Promise<TransactionReturn<void>>;
/**
 * Withdraws a token on an Ethereum chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param signer The signer instance from ethers.js
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
export declare function withdrawTokenEthereum(chain: Chain, message: UnsignedMessageType, signatures: Signature[], signer: Signer, setProgress: (progress: Progress) => void): Promise<TransactionReturn<void>>;
export declare function getLockedTokenFromWrappedEthereum(chain: Chain, wrappedId: number, signer: Signer): Promise<LockedTokenType>;
