/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
export declare enum Chain {
    Tezos = "Tezos",
    Ethereum = "Ethereum"
}
/**
 * Checks whether the input is of the Chain enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export declare function isChain(input: any): input is Chain;
/**
 * Represents constants associated with a chain.
 */
export declare type ChainConstantsType = {
    name: string;
    symbol: string;
};
/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
export declare const chainConstants: {
    [key in Chain]: ChainConstantsType;
};
