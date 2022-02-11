/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
export declare enum Chain {
    Tezos = "Tezos",
    Ethereum = "Ethereum"
}
/**
 * Represents constants associated with a chain.
 */
export declare type ChainConstantsType = {
    name: string;
    symbol: string;
};
/**
 * Represents a pair of chains.
 * Used in bridging (from source to target).
 */
export declare type ChainPairType = {
    source: Chain;
    target: Chain;
};
/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
export declare const chainConstants: {
    [key in Chain]: ChainConstantsType;
};
