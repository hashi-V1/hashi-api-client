"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashiIndexerUrl = exports.isTokenWrapped = exports.nodesConfig = exports.chainConfig = void 0;
var chain_1 = require("./types/chain");
/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
exports.chainConfig = (_a = {},
    _a[chain_1.Chain.Tezos] = {
        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Hangzhounet] = {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1CLQYiQtTQdfrPaMKvwCa2VSboF8ih1T9R",
        wrapperContract: "KT1J8pUqUtinAkBCzZ2fuUrz4JJEefofm4k5",
    },
    _a[chain_1.Chain.Ethereum] = {
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Ropsten] = {
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
        wrapperContract: "0x43a31963eb24ef0cf9d35e2ba463589ff6f9efc4",
    },
    _a);
/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
exports.nodesConfig = [
    "http://localhost:3030/proof",
    "http://localhost:3030/proof",
];
function isTokenWrapped(token, chain) {
    return exports.chainConfig[chain].wrapperContract === token.tokenContract;
}
exports.isTokenWrapped = isTokenWrapped;
exports.hashiIndexerUrl = "https://hashi-indexer.netlify.app/api";
//# sourceMappingURL=config.js.map