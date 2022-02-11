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
export declare const ChainConfig: {
    [key in Chain]: ChainConfigType;
};
