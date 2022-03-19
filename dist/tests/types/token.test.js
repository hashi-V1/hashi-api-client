"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chain_1 = require("../../lib/types/chain");
var token_1 = require("../../lib/types/token");
describe("token", function () {
    it("isLockedTokenType should return true if input is LockedTokenType", function () {
        var lockedToken = {
            tokenContract: "fdghfhjfhdsjf",
            tokenId: 5,
            timestamp: 345674567,
        };
        chai_1.assert.isTrue((0, token_1.isLockedTokenType)(lockedToken));
    });
    it("isLockedTokenType should return false when input is not LockedTokenType", function () {
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)(undefined));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)(null));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)("test"));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)(4));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: null,
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: "",
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: "fdsfgdfhdf",
            tokenId: null,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: "dghfghfghdfhdf",
            tokenId: Number.NaN,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: "dfgdfgdfgdf",
            tokenId: 5,
            timestamp: null,
        }));
        chai_1.assert.isFalse((0, token_1.isLockedTokenType)({
            tokenContract: "dfgdfgdfgdf",
            tokenId: 5,
            timestamp: Number.NaN,
        }));
    });
    it("tokenFromAddressAndId should return a Token", function () {
        var tokenContract = "dfghjfgrdeszq";
        var tokenId = 5;
        var chain = chain_1.Chain.Tezos;
        var token = (0, token_1.tokenFromAddressAndId)(tokenContract, tokenId, chain);
        chai_1.assert.strictEqual(token.tokenContract, tokenContract);
        chai_1.assert.strictEqual(token.tokenId, tokenId);
        chai_1.assert.strictEqual(token.chain, chain);
    });
    it("tokenFromAddressAndIf should throw when parameters are not well formatted", function () {
        var tokenContract = "dfghjfgrdeszq";
        var tokenId = 5;
        var chain = chain_1.Chain.Tezos;
        chai_1.assert.throws(function () { return (0, token_1.tokenFromAddressAndId)("", tokenId, chain); });
        chai_1.assert.throws(function () {
            return (0, token_1.tokenFromAddressAndId)(tokenContract, Number.NaN, chain);
        });
        chai_1.assert.throws(function () {
            return (0, token_1.tokenFromAddressAndId)(tokenContract, tokenId, "Test");
        });
    });
    it("isToken should return true if input is IndexedToken", function () {
        var token = {
            tokenContract: "fdghfhjfhdsjf",
            tokenId: 5,
            name: "token",
            chain: chain_1.Chain.Tezos,
            uid: "fdghfhjfhdsjf-5",
            wrapped: false,
            imageUrl: "https://djgikjdfikgjd.png",
            description: "description",
            symbol: "NFT",
        };
        chai_1.assert.isTrue((0, token_1.isToken)(token));
    });
    it("isToken should return false when input is not IndexedToken", function () {
        chai_1.assert.isFalse((0, token_1.isToken)(undefined));
        chai_1.assert.isFalse((0, token_1.isToken)(null));
        chai_1.assert.isFalse((0, token_1.isToken)("test"));
        chai_1.assert.isFalse((0, token_1.isToken)(4));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: null,
            tokenId: 5,
            name: "token",
        }));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: "",
            tokenId: 5,
            name: "token",
        }));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: "fdsfgdfhdf",
            tokenId: null,
            name: "token",
        }));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: "dghfghfghdfhdf",
            tokenId: Number.NaN,
            name: "token",
        }));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: "dfgdfgdfgdf",
            tokenId: 5,
            name: null,
        }));
        chai_1.assert.isFalse((0, token_1.isToken)({
            tokenContract: "dfgdfgdfgdf",
            tokenId: 5,
            name: "",
        }));
    });
});
//# sourceMappingURL=token.test.js.map