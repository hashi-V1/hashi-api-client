import { Chain } from "./types/chain";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
    name: string;
    symbol: string;

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

        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Hangzhounet]: {
        name: Chain.Hangzhounet,
        symbol: "XTZ",

        rpc: "https://rpc.hangzhounet.teztnets.xyz",
        lockerContract: "KT1CLQYiQtTQdfrPaMKvwCa2VSboF8ih1T9R",
        wrapperContract: "KT1Gj6ePgbVFMsFQmY8tkS3tAYAKCEY8cTGx",
    },

    [Chain.Ethereum]: {
        name: Chain.Ethereum,
        symbol: "ETH",

        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Ropsten]: {
        name: Chain.Ropsten,
        symbol: "ETH",

        lockerContract: "0xA32AfCc4637e957FBDc9c6682DE80Be00cb44963",
        wrapperContract: "0xc0c713b04A8603A6af387C5a2Df323380A74600f",
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
