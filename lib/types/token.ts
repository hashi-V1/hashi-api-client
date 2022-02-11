import { Chain } from "./chain";

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
