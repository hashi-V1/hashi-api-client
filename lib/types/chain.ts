/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
export enum Chain {
    Tezos = "Tezos",
    Hangzhounet = "Hangzhounet",

    Ethereum = "Ethereum",
    Ropsten = "Ropsten",
}

/**
 * Checks whether the input is of the Chain enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export function isChain(input: any): input is Chain {
    return Object.values(Chain).includes(input);
}

/**
 * Represents constants associated with a chain.
 */
export type ChainConstantsType = {
    name: string;
    symbol: string;
};

/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
export const chainConstants: { [key in Chain]: ChainConstantsType } = {
    [Chain.Tezos]: {
        name: Chain.Tezos,
        symbol: "XTZ",
    },
    [Chain.Hangzhounet]: {
        name: Chain.Hangzhounet,
        symbol: "XTZ",
    },

    [Chain.Ethereum]: {
        name: Chain.Ethereum,
        symbol: "ETH",
    },
    [Chain.Ropsten]: {
        name: Chain.Ropsten,
        symbol: "ETH",
    },
};
