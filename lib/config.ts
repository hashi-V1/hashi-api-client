import { Chain } from "./types/chain";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
    rpc: string;
    lockerContract: string;
};

/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
export const ChainConfig: { [key in Chain]: ChainConfigType } = {
    [Chain.Tezos]: {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1S1W5GtQqUYXGYoLEX4NvKvCiqquKvSrjY",
    },
    [Chain.Ethereum]: {
        rpc: "",
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
    },
};
