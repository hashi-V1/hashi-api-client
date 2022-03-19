"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainConstants = exports.isChain = exports.Chain = void 0;
/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
var Chain;
(function (Chain) {
    Chain["Tezos"] = "Tezos";
    Chain["Hangzhounet"] = "Hangzhounet";
    Chain["Ethereum"] = "Ethereum";
    Chain["Ropsten"] = "Ropsten";
})(Chain = exports.Chain || (exports.Chain = {}));
/**
 * Checks whether the input is of the Chain enum type
 * @param input Any input
 * @returns a boolean and a type predicate
 */
function isChain(input) {
    return Object.values(Chain).includes(input);
}
exports.isChain = isChain;
/**
 * Lists constants (ChainConstantsType) of all chains defined in Chain.
 */
exports.chainConstants = (_a = {},
    _a[Chain.Tezos] = {
        name: Chain.Tezos,
        symbol: "XTZ",
    },
    _a[Chain.Hangzhounet] = {
        name: Chain.Hangzhounet,
        symbol: "XTZ",
    },
    _a[Chain.Ethereum] = {
        name: Chain.Ethereum,
        symbol: "ETH",
    },
    _a[Chain.Ropsten] = {
        name: Chain.Ropsten,
        symbol: "ETH",
    },
    _a);
//# sourceMappingURL=chain.js.map