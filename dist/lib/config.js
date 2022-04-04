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
    _a[chain_1.Chain.Hangzhounet] = {
        name: chain_1.Chain.Hangzhounet,
        symbol: "XTZ",
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1CLQYiQtTQdfrPaMKvwCa2VSboF8ih1T9R",
        wrapperContract: "KT1Gj6ePgbVFMsFQmY8tkS3tAYAKCEY8cTGx",
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