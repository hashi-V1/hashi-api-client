export declare enum Chain {
    Tezos = 0,
    Ethereum = 1
}
export declare type ChainConstantsType = {
    name: string;
    symbol: string;
    abbrev: string;
};
export declare type ChainPairType = {
    source: Chain;
    target: Chain;
};
export declare const ChainsConstants: {
    [key in Chain]: ChainConstantsType;
};
