export var Chain;
(function (Chain) {
    Chain[Chain["Tezos"] = 0] = "Tezos";
    Chain[Chain["Ethereum"] = 1] = "Ethereum";
})(Chain || (Chain = {}));
export const ChainsConstants = {
    [Chain.Tezos]: {
        name: "Tezos",
        symbol: "XTZ",
        abbrev: "tez",
    },
    [Chain.Ethereum]: {
        name: "Ethereum",
        symbol: "ETH",
        abbrev: "eth",
    },
};
//# sourceMappingURL=chains.js.map