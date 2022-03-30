"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chain_1 = require("../../lib/types/chain");
describe("chain", function () {
    it("isChain should be true when the input is a Chain", function () {
        chai_1.assert.isTrue((0, chain_1.isChain)(chain_1.Chain.Tezos));
        chai_1.assert.isTrue((0, chain_1.isChain)(chain_1.Chain.Ethereum));
    });
    it("isChain should be false when the input is not a Chain", function () {
        chai_1.assert.isFalse((0, chain_1.isChain)(4));
        chai_1.assert.isFalse((0, chain_1.isChain)("Test"));
        chai_1.assert.isFalse((0, chain_1.isChain)("TezosEthereum"));
    });
});
//# sourceMappingURL=chain.test.js.map