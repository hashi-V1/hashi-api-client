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
 * timestamp should be in milliseconds
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
    chain: Chain;
    uid: string;
    wrapped: boolean;
    name?: string;
    imageUrl?: string;
    description?: string;
    symbol?: string;
};
export declare function isToken(input: any): input is Token;
/**
 * Creates a token object from its contract address and id and its chain.
 * @param tokenContract
 * @param tokenId
 * @param chain
 * @returns a Token
 */
export declare function tokenFromAddressAndId(tokenContract: string, tokenId: number, chain: Chain): Token;
/**
 * Checks whether the token's contract is a wrapper
 * @param tokenContract The token's contract address
 * @param chain The current chain of the token
 * @returns a boolean
 */
export declare function isTokenWrapped(tokenContract: string, chain: Chain): boolean;
