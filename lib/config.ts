import { Chain } from "./types/chain";

/**
 * Represents the configuration fields for a specific chain.
 */
export type ChainConfigType = {
    rpc: string;
    lockerContract: string;
    wrapperContract: string;
};

/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
export const ChainConfig: { [key in Chain]: ChainConfigType } = {
    [Chain.Tezos]: {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1S1W5GtQqUYXGYoLEX4NvKvCiqquKvSrjY",
        wrapperContract: "KT1DhLyx7FfpM28UXLqzoAezWPX6kTaWxUsV",
    },
    [Chain.Ethereum]: {
        rpc: "",
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
        wrapperContract: "0x43a31963eb24ef0cf9d35e2ba463589ff6f9efc4",
    },
};
