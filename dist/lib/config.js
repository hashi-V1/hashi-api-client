"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashiIndexerUrl = exports.nodesConfig = exports.chainConfig = void 0;
var chain_1 = require("./types/chain");
/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
exports.chainConfig = (_a = {},
    _a[chain_1.Chain.Tezos] = {
        name: chain_1.Chain.Tezos,
        symbol: "XTZ",
        id: 1,
        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Ithacanet] = {
        name: chain_1.Chain.Ithacanet,
        symbol: "XTZ",
        id: 1,
        rpc: "https://ithacanet.smartpy.io/",
        lockerContract: "KT1MNzBdh1KaQTGozGwmDxLJQtxLBjxjNARy",
        wrapperContract: "KT1N2EwbM9dRPTXhA3DgZe4ukPKXzS99jnfu",
    },
    _a[chain_1.Chain.Ethereum] = {
        name: chain_1.Chain.Ethereum,
        symbol: "ETH",
        id: 2,
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Ropsten] = {
        name: chain_1.Chain.Ropsten,
        symbol: "ETH",
        id: 2,
        lockerContract: "0xa475222b712cdfea19525c0651c6c36245e89fa3",
        wrapperContract: "0x6299ef59d138f99f5080a3db2b8d9e16b9afdd14",
    },
    _a);
/**
 * Contains a list of valid nodes from the Federation that will be used to prove statuses.
 * The url should be absolute (Protocol + hostname (+ port) + path)
 * e.g. "http://localhost:3030/proof"
 */
exports.nodesConfig = [
    "https://proxy1.validators.hashiprotocol.com:9000/proof",
];
/**
 * Url of the hashi indexer.
 * Used to retrieve a user's token inventory.
 */
exports.hashiIndexerUrl = "https://indexer.hashiprotocol.com/api";
//# sourceMappingURL=config.js.map