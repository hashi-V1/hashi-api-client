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
export const chainConstants: { [key in Chain]: ChainConstantsType } = {
    [Chain.Tezos]: {
        name: Chain.Tezos,
        symbol: "XTZ",
    },
    [Chain.Ethereum]: {
        name: Chain.Ethereum,
        symbol: "ETH",
    },
};
