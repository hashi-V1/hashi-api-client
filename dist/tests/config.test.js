"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var config_1 = require("../lib/config");
var chain_1 = require("../lib/types/chain");
var utils_1 = require("../lib/utils");
describe("config testing", function () {
    it("Nodes should be populated properly", function () {
        chai_1.assert.isAtLeast(config_1.nodesConfig.length, 1, "nodesConfig should contain at least one node.");
        for (var node in config_1.nodesConfig) {
            chai_1.assert.isNotEmpty(node, "Nodes should not have empty endpoints.");
        }
    });
    it("chainConfig should contain valid informations", function () {
        for (var chain in chain_1.Chain) {
            chai_1.assert.isTrue((0, utils_1.hasOwnProperty)(config_1.chainConfig, chain), "chainConfig does not contain chain ".concat(chain));
            chai_1.assert.strictEqual(config_1.chainConfig[chain].name, chain, "chain should have the same name as in Chain for ".concat(chain));
            chai_1.assert.isNotEmpty(config_1.chainConfig[chain].symbol, "symbol should not be empty for chain ".concat(chain));
            chai_1.assert.isNotEmpty(config_1.chainConfig[chain].lockerContract, "lockerContract is empty in chainConfig for chain ".concat(chain));
            chai_1.assert.isNotEmpty(config_1.chainConfig[chain].wrapperContract, "wrapperContract is empty in chainConfig for chain ".concat(chain));
        }
    });
});
//# sourceMappingURL=config.test.js.map