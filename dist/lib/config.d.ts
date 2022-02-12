import { Chain } from "./types/chain";
/**
 * Represents the configuration fields for a specific chain.
 */
export declare type ChainConfigType = {
    rpc: string;
    lockerContract: string;
    wrapperContract: string;
};
/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
export declare const chainConfig: {
    [key in Chain]: ChainConfigType;
};
/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
export declare const nodesConfig: string[];
