"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isChain = exports.Chain = void 0;
/**
 * Represents a chain (a blockchain specific network).
 * Example: Ethereum-Ropsten is a different chain than Ethereum (Mainnet).
 */
var Chain;
(function (Chain) {
    Chain["Tezos"] = "Tezos";
    Chain["Ithacanet"] = "Ithacanet";
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
//# sourceMappingURL=chain.js.map