import { Chain } from "./chain";
/**
 * Represents a token emitted by a wrapper on a specific chain
 */
export declare type WrappedTokenType = {
    tokenContract: string;
    tokenId: number;
    chain: Chain;
};
/**
 * Represents a token locked by hashi
 */
export declare type LockedTokenType = {
    tokenContract: string;
    tokenId: number;
    timestamp: number;
};
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export declare function isLockedTokenType(input: any): input is LockedTokenType;
/**
 * Represents a Token uniquely across all chains.
 */
export declare type Token = {
    tokenContract: string;
    tokenId: number;
    currentChain: Chain;
    initialChain: Chain;
};
/**
 * Creates a token object from its contract address and id and its chain.
 * TODO Implement something to retrieve the real state of the token (initial and current chains);
 * @param tokenContract
 * @param tokenId
 * @param chain
 * @returns a Token
 */
export declare function tokenFromAddressAndId(tokenContract: string, tokenId: number, chain: Chain): Token;
