"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainConstants = exports.Chain = void 0;
/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
var Chain;
(function (Chain) {
    Chain["Tezos"] = "Tezos";
    Chain["Ethereum"] = "Ethereum";
})(Chain = exports.Chain || (exports.Chain = {}));
/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
exports.chainConstants = (_a = {},
    _a[Chain.Tezos] = {
        name: Chain.Tezos,
        symbol: "XTZ",
    },
    _a[Chain.Ethereum] = {
        name: Chain.Ethereum,
        symbol: "ETH",
    },
    _a);
//# sourceMappingURL=chain.js.map