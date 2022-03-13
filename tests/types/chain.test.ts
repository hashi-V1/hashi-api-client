import { assert } from "chai";
import { Chain, chainConstants, isChain } from "../../lib/types/chain";
import { hasOwnProperty } from "../../lib/utils";

describe("chain", () => {
    it("isChain should be true when the input is a Chain", () => {
        assert.isTrue(isChain(Chain.Tezos));
        assert.isTrue(isChain(Chain.Ethereum));
    });

    it("isChain should be false when the input is not a Chain", () => {
        assert.isFalse(isChain(4));
        assert.isFalse(isChain("Test"));
        assert.isFalse(isChain("TezosEthereum"));
    });

    it("chainConstants should be properly filled", () => {
        for (const chain in Chain) {
            const contains = hasOwnProperty(chainConstants, chain);
            assert.isTrue(
                contains,
                `chainConstants does not contain chain ${chain}`
            );

            if (contains) {
                assert.strictEqual(
                    chainConstants[chain as Chain].name,
                    chain,
                    `chain should have the same name as in Chain for ${chain}`
                );

                assert.isNotEmpty(
                    chainConstants[chain as Chain].symbol,
                    `symbol should not be empty for chain ${chain}`
                );
            }
        }
    });
});
