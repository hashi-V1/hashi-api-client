import { assert } from "chai";
import { Chain } from "../../lib/types/chain";
import {
    isProofRequestType,
    isStatus,
    ProofRequestType,
    Status,
} from "../../lib/types/proof";

describe("proof type", () => {
    it("isStatus should return true when the input is a Status", () => {
        assert.isTrue(isStatus(Status.Locked));
        assert.isTrue(isStatus(Status.Burned));
    });

    it("isStatus should return false when the input is not a Status", () => {
        assert.isFalse(isStatus(undefined));
        assert.isFalse(isStatus(null));
        assert.isFalse(isStatus("test"));
        assert.isFalse(isStatus(45));
    });

    it("isProofRequestType should return true when the input is a ProofRequestType", () => {
        const request: ProofRequestType = {
            sourceChain: Chain.Tezos,
            targetChain: Chain.Ethereum,
            status: Status.Locked,
            tokenContract: "rfdghjhgfds",
            tokenId: 5,
            timestamp: 1647745387000,
        };
        assert.isTrue(isProofRequestType(request));
    });

    it("isProofRequestType should return false when the input is not a ProofRequestType", () => {
        assert.isFalse(isProofRequestType(undefined));
        assert.isFalse(isProofRequestType(null));
        assert.isFalse(isProofRequestType("test"));
        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: null,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: 5,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: null,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: 5,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: null,
                tokenContract: "rfdghjhgfds",
                tokenId: 5,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "",
                tokenId: 5,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: null,
                tokenId: 5,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: null,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: Number.NaN,
                timestamp: 1647745387000,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: 5,
                timestamp: null,
            })
        );

        assert.isFalse(
            isProofRequestType({
                sourceChain: Chain.Tezos,
                targetChain: Chain.Ethereum,
                status: Status.Locked,
                tokenContract: "rfdghjhgfds",
                tokenId: 5,
                timestamp: Number.NaN,
            })
        );
    });
});
