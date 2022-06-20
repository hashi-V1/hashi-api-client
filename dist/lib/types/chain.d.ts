/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
export declare enum Chain {
    Tezos = "Tezos",
    Ithacanet = "Ithacanet",
    Ethereum = "Ethereum",
    Ropsten = "Ropsten"
}
/**
 * Checks whether the input is of the Chain enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
export declare function isChain(input: any): input is Chain;
