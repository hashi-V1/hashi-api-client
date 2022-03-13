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
        chai_1.assert.strictEqual(token.currentChain, chain);
        chai_1.assert.strictEqual(token.initialChain, chain); // TODO: implement initial chain
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
});
//# sourceMappingURL=token.test.js.map