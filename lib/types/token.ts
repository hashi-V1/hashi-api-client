import { Chain } from "./chain";

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
    const m = input as LockedTokenType;
    return (
        m.tokenContract != null &&
        m.tokenContract != "" &&
        m.tokenId != null &&
        !isNaN(m.tokenId) &&
        m.timestamp != null &&
        !isNaN(m.timestamp)
    );
}

/**
 * Represents a Token uniquely across all chains.
 */
export type Token = {
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
export function tokenFromAddressAndId(
    tokenContract: string,
    tokenId: number,
    chain: Chain
): Token {
    return {
        tokenContract,
        tokenId,
        currentChain: chain,
        initialChain: chain,
    };
}
