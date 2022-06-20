import { Chain } from "./types/chain";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
    name: string;
    symbol: string;
    id: number;

    rpc?: string;
    lockerContract: string;
    wrapperContract: string;
};

/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
export const chainConfig: { [key in Chain]: ChainConfigType } = {
    [Chain.Tezos]: {
        name: Chain.Tezos,
        symbol: "XTZ",
        id: 1,

        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Ithacanet]: {
        name: Chain.Ithacanet,
        symbol: "XTZ",
        id: 1,

        rpc: "https://ithacanet.smartpy.io/",
        lockerContract: "KT1MNzBdh1KaQTGozGwmDxLJQtxLBjxjNARy",
        wrapperContract: "KT1N2EwbM9dRPTXhA3DgZe4ukPKXzS99jnfu",
    },

    [Chain.Ethereum]: {
        name: Chain.Ethereum,
        symbol: "ETH",
        id: 2,

        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Ropsten]: {
        name: Chain.Ropsten,
        symbol: "ETH",
        id: 2,

        lockerContract: "0xa475222b712cdfea19525c0651c6c36245e89fa3",
        wrapperContract: "0x6299ef59d138f99f5080a3db2b8d9e16b9afdd14",
    },
};

/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
export const nodesConfig: string[] = [
    "https://proxy1.validators.hashiprotocol.com:9000/proof",
];

/**
 * Url of the hashi indexer.
 * Used to retrieve a user's token inventory.
 */
export const hashiIndexerUrl = "https://indexer.hashiprotocol.com/api";
