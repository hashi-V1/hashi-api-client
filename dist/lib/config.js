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
        rpc: "https://mainnet-node.madfish.solutions",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Ithacanet] = {
        name: chain_1.Chain.Ithacanet,
        symbol: "XTZ",
        rpc: "https://ithacanet.smartpy.io/",
        lockerContract: "KT1N2EwbM9dRPTXhA3DgZe4ukPKXzS99jnfu",
        wrapperContract: "KT1MJPtWTscdpNtNtg4DvqHDNoKwCoERQEty",
    },
    _a[chain_1.Chain.Ethereum] = {
        name: chain_1.Chain.Ethereum,
        symbol: "ETH",
        lockerContract: "not implemented",
        wrapperContract: "not implemented",
    },
    _a[chain_1.Chain.Ropsten] = {
        name: chain_1.Chain.Ropsten,
        symbol: "ETH",
        lockerContract: "0xA32AfCc4637e957FBDc9c6682DE80Be00cb44963",
        wrapperContract: "0xc0c713b04A8603A6af387C5a2Df323380A74600f",
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