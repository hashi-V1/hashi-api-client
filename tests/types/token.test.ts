import { assert } from "chai";
import { Chain } from "../../lib/types/chain";
import {
    isLockedTokenType,
    isToken,
    LockedTokenType,
    Token,
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
        assert.strictEqual(token.chain, chain);
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

    it("isToken should return true if input is IndexedToken", () => {
        const token: Token = {
            tokenContract: "fdghfhjfhdsjf",
            tokenId: 5,
            name: "token",
            chain: Chain.Tezos,
            uid: "fdghfhjfhdsjf-5",
            wrapped: false,

            imageUrl: "https://djgikjdfikgjd.png",
            description: "description",
            symbol: "NFT",
        };

        assert.isTrue(isToken(token));
    });

    it("isToken should return false when input is not IndexedToken", () => {
        assert.isFalse(isToken(undefined));
        assert.isFalse(isToken(null));
        assert.isFalse(isToken("test"));
        assert.isFalse(isToken(4));

        assert.isFalse(
            isToken({
                tokenContract: null,
                tokenId: 5,
                name: "token",
            })
        );

        assert.isFalse(
            isToken({
                tokenContract: "",
                tokenId: 5,
                name: "token",
            })
        );

        assert.isFalse(
            isToken({
                tokenContract: "fdsfgdfhdf",
                tokenId: null,
                name: "token",
            })
        );

        assert.isFalse(
            isToken({
                tokenContract: "dghfghfghdfhdf",
                tokenId: Number.NaN,
                name: "token",
            })
        );

        assert.isFalse(
            isToken({
                tokenContract: "dfgdfgdfgdf",
                tokenId: 5,
                name: null,
            })
        );

        assert.isFalse(
            isToken({
                tokenContract: "dfgdfgdfgdf",
                tokenId: 5,
                name: "",
            })
        );
    });
});
