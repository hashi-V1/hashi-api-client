import { Chain } from "./types/chain";
import { Token } from "./types/token";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
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
        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Hangzhounet]: {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1CLQYiQtTQdfrPaMKvwCa2VSboF8ih1T9R",
        wrapperContract: "KT1Gj6ePgbVFMsFQmY8tkS3tAYAKCEY8cTGx",
    },

    [Chain.Ethereum]: {
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    [Chain.Ropsten]: {
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
        wrapperContract: "0xc0c713b04A8603A6af387C5a2Df323380A74600f",
    },
};

/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
export const nodesConfig: string[] = [
    "http://localhost:3030/proof",
    "http://localhost:3030/proof",
];

export function isTokenWrapped(token: Token, chain: Chain) {
    return chainConfig[chain].wrapperContract === token.tokenContract;
}

export const hashiIndexerUrl = "https://hashi-indexer.netlify.app/api";
