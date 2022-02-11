"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainConfig = void 0;
var chain_1 = require("./types/chain");
/**
 * Contains the constant configuration for each chain
 * RPCs and contract addresses should be placed here.
 */
exports.ChainConfig = (_a = {},
    _a[chain_1.Chain.Tezos] = {
        rpc: "https://hangzhounet.smartpy.io/",
        lockerContract: "KT1S1W5GtQqUYXGYoLEX4NvKvCiqquKvSrjY",
        wrapperContract: "KT1DhLyx7FfpM28UXLqzoAezWPX6kTaWxUsV",
    },
    _a[chain_1.Chain.Ethereum] = {
        rpc: "",
        lockerContract: "0x1b4622d90811f57020e96f78f1f2883020882780",
        wrapperContract: "0x43a31963eb24ef0cf9d35e2ba463589ff6f9efc4",
    },
    _a);
//# sourceMappingURL=config.js.map