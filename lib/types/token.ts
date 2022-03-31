import { chainConfig } from "../config";
import { isMillisTimestamp } from "../utils";
import { Chain, isChain } from "./chain";

/**
 * Represents a token emitted by a wrapper on a specific chain
 */
export type WrappedTokenType = {
    tokenContract: string;
    tokenId: number;
    chain: Chain;
};

/**
 * Represents a token locked by hashi
 * timestamp should be in milliseconds
 */
export type LockedTokenType = {
    tokenContract: string;
    tokenId: number;
    timestamp: number;
};

/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
export function isLockedTokenType(input: any): input is LockedTokenType {
    if (typeof input === "undefined" || input == null) return false;
    const m = input as LockedTokenType;
    return (
        m.tokenContract != null &&
        m.tokenContract != "" &&
        m.tokenId != null &&
        !isNaN(m.tokenId) &&
        m.timestamp != null &&
        isMillisTimestamp(m.timestamp)
    );
}

/**
 * Represents a Token uniquely across all chains.
 */
export type Token = {
    tokenContract: string;
    tokenId: number;
    chain: Chain;
    uid: string;
    wrapped: boolean;
    name: string;

    imageUrl?: string;
    description?: string;
    symbol?: string;
};

export function isToken(input: any): input is Token {
    if (typeof input === "undefined" || input == null) return false;
    const token = input as Token;
    return (
        token.tokenContract != null &&
        token.tokenContract != "" &&
        token.tokenId != null &&
        !isNaN(token.tokenId) &&
        token.uid != null &&
        token.uid != "" &&
        isChain(token.chain) &&
        token.name != null &&
        token.name != ""
    );
}

/**
 * Creates a token object from its contract address and id and its chain.
 * @param tokenContract
 * @param tokenId
 * @param chain
 * @returns a Token
 */
export function tokenFromAddressAndId(
    tokenContract: string,
    tokenId: number,
    chain: Chain
): Token {
    if (tokenContract === "") {
        throw new Error("tokenContract cannot be empty to build a token.");
    }
    if (isNaN(tokenId)) {
        throw new Error("tokenId must be a valid integer to build a token.");
    }
    if (!isChain(chain)) {
        throw new Error("chain is not a valid Chain to build a token.");
    }

    return {
        tokenContract,
        tokenId,
        chain,
        uid: `${tokenContract}-${tokenId}`,
        wrapped: isTokenWrapped(tokenContract, chain),
        name: `${tokenContract}-${tokenId}`,
    };
}

/**
 * Checks whether the token's contract is a wrapper
 * @param tokenContract The token's contract address
 * @param chain The current chain of the token
 * @returns a boolean
 */
export function isTokenWrapped(tokenContract: string, chain: Chain) {
    // Ignore case when comparing addresses.
    return (
        chainConfig[chain].wrapperContract.localeCompare(
            tokenContract,
            undefined,
            { sensitivity: "accent" }
        ) === 0
    );
}
