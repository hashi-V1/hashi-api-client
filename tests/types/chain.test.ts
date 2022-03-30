import { assert } from "chai";
import { Chain, isChain } from "../../lib/types/chain";

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
});
