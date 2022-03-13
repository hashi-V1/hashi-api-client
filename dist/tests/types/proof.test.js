"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chain_1 = require("../../lib/types/chain");
var proof_1 = require("../../lib/types/proof");
describe("proof type", function () {
    it("isStatus should return true when the input is a Status", function () {
        chai_1.assert.isTrue((0, proof_1.isStatus)(proof_1.Status.Locked));
        chai_1.assert.isTrue((0, proof_1.isStatus)(proof_1.Status.Burned));
    });
    it("isStatus should return false when the input is not a Status", function () {
        chai_1.assert.isFalse((0, proof_1.isStatus)(undefined));
        chai_1.assert.isFalse((0, proof_1.isStatus)(null));
        chai_1.assert.isFalse((0, proof_1.isStatus)("test"));
        chai_1.assert.isFalse((0, proof_1.isStatus)(45));
    });
    it("isProofRequestType should return true when the input is a ProofRequestType", function () {
        var request = {
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: 3456786543,
        };
        chai_1.assert.isTrue((0, proof_1.isProofRequestType)(request));
    });
    it("isProofRequestType should return false when the input is not a ProofRequestType", function () {
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)(undefined));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)(null));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)("test"));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: null,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: null,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: null,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "",
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: null,
            tokenId: 5,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: null,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: Number.NaN,
            timestamp: 3456786543,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: null,
        }));
        chai_1.assert.isFalse((0, proof_1.isProofRequestType)({
            sourceChain: chain_1.Chain.Tezos,
            targetChain: chain_1.Chain.Ethereum,
            status: proof_1.Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: Number.NaN,
        }));
    });
});
//# sourceMappingURL=proof.test.js.map