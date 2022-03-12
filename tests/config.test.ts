import { assert } from "chai";
import { chainConfig, nodesConfig } from "../lib/config";
import { Chain } from "../lib/types/chain";
import { hasOwnProperty } from "../lib/utils";

describe("config testing", () => {
    it("Nodes should be populated properly", () => {
        assert.isAtLeast(
            nodesConfig.length,
            1,
            "nodesConfig should contain at least one node."
        );

        for (const node in nodesConfig) {
            assert.isNotEmpty(node, "Nodes should not have empty endpoints.");
        }
    });

    it("chainConfig should contain valid informations", () => {
        for (const chain in Chain) {
            assert.isTrue(
                hasOwnProperty(chainConfig, chain),
                `chainConfig does not contain chain ${chain}`
            );

            assert.isNotEmpty(
                chainConfig[chain as Chain].lockerContract,
                `lockerContract is empty in chainConfig for chain ${chain}`
            );
            assert.isNotEmpty(
                chainConfig[chain as Chain].wrapperContract,
                `wrapperContract is empty in chainConfig for chain ${chain}`
            );
        }
    });
});
