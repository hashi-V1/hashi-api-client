/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
export enum Chain {
    Tezos = "Tezos",
    Ethereum = "Ethereum",
}

/**
 * Represents constants associated with a chain.
 */
export type ChainConstantsType = {
    name: string;
    symbol: string;
    abbrev: string;
};

/**
 * Represents a pair of chains.
 * Used in bridging (from source to target).
 */
export type ChainPairType = {
    source: Chain;
    target: Chain;
};

/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
export const ChainConstants: { [key in Chain]: ChainConstantsType } = {
    [Chain.Tezos]: {
        name: "Tezos",
        symbol: "XTZ",
        abbrev: "tez",
    },
    [Chain.Ethereum]: {
        name: "Ethereum",
        symbol: "ETH",
        abbrev: "eth",
    },
};
