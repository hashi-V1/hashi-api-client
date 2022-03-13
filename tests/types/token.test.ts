import { assert } from "chai";
import { Chain } from "../../lib/types/chain";
import {
    isLockedTokenType,
    LockedTokenType,
    tokenFromAddressAndId,
} from "../../lib/types/token";

describe("token", () => {
    it("isLockedTokenType should return true if input is LockedTokenType", () => {
        const lockedToken: LockedTokenType = {
            tokenContract: "fdghfhjfhdsjf",
            tokenId: 5,
            timestamp: 345674567,
        };

        assert.isTrue(isLockedTokenType(lockedToken));
    });

    it("isLockedTokenType should return false when input is not LockedTokenType", () => {
        assert.isFalse(isLockedTokenType(undefined));
        assert.isFalse(isLockedTokenType(null));
        assert.isFalse(isLockedTokenType("test"));
        assert.isFalse(isLockedTokenType(4));

        assert.isFalse(
            isLockedTokenType({
                tokenContract: null,
                tokenId: 5,
                timestamp: 3456786543,
            })
        );

        assert.isFalse(
            isLockedTokenType({
                tokenContract: "",
                tokenId: 5,
                timestamp: 3456786543,
            })
        );

        assert.isFalse(
            isLockedTokenType({
                tokenContract: "fdsfgdfhdf",
                tokenId: null,
                timestamp: 3456786543,
            })
        );

        assert.isFalse(
            isLockedTokenType({
                tokenContract: "dghfghfghdfhdf",
                tokenId: Number.NaN,
                timestamp: 3456786543,
            })
        );

        assert.isFalse(
            isLockedTokenType({
                tokenContract: "dfgdfgdfgdf",
                tokenId: 5,
                timestamp: null,
            })
        );

        assert.isFalse(
            isLockedTokenType({
                tokenContract: "dfgdfgdfgdf",
                tokenId: 5,
                timestamp: Number.NaN,
            })
        );
    });

    it("tokenFromAddressAndId should return a Token", () => {
        const tokenContract = "dfghjfgrdeszq";
        const tokenId = 5;
        const chain = Chain.Tezos;

        const token = tokenFromAddressAndId(tokenContract, tokenId, chain);

        assert.strictEqual(token.tokenContract, tokenContract);
        assert.strictEqual(token.tokenId, tokenId);
        assert.strictEqual(token.currentChain, chain);
        assert.strictEqual(token.initialChain, chain); // TODO: implement initial chain
    });

    it("tokenFromAddressAndIf should throw when parameters are not well formatted", () => {
        const tokenContract = "dfghjfgrdeszq";
        const tokenId = 5;
        const chain = Chain.Tezos;

        assert.throws(() => tokenFromAddressAndId("", tokenId, chain));
        assert.throws(() =>
            tokenFromAddressAndId(tokenContract, Number.NaN, chain)
        );
        assert.throws(() =>
            tokenFromAddressAndId(tokenContract, tokenId, "Test" as Chain)
        );
    });
});
