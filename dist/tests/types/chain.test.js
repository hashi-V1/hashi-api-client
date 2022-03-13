"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chain_1 = require("../../lib/types/chain");
var utils_1 = require("../../lib/utils");
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
    it("chainConstants should be properly filled", function () {
        for (var chain in chain_1.Chain) {
            var contains = (0, utils_1.hasOwnProperty)(chain_1.chainConstants, chain);
            chai_1.assert.isTrue(contains, "chainConstants does not contain chain ".concat(chain));
            if (contains) {
                chai_1.assert.strictEqual(chain_1.chainConstants[chain].name, chain, "chain should have the same name as in Chain for ".concat(chain));
                chai_1.assert.isNotEmpty(chain_1.chainConstants[chain].symbol, "symbol should not be empty for chain ".concat(chain));
            }
        }
    });
});
//# sourceMappingURL=chain.test.js.map