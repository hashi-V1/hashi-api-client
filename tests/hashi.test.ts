import { assert, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { HashiBridge } from "../lib/hashi";
import { Chain } from "../lib/types/chain";
import {
    EmptyDestinationAddressError,
    NoSignerForChainError,
} from "../lib/types/errors";
import { Status, UnsignedMessageType } from "../lib/types/proof";
import { LockedTokenType, Token, WrappedTokenType } from "../lib/types/token";
use(chaiAsPromised);

describe("HashiBridge", () => {
    const token: Token = {
        tokenContract: "tzjredfrhgjkujrefd",
        tokenId: 5,
        currentChain: Chain.Tezos,
        initialChain: Chain.Ethereum,
    };

    const lockedToken: LockedTokenType = {
        tokenContract: "tzjredfrhgjkujrefd",
        tokenId: 5,
        timestamp: 4467897754,
    };

    const wrappedToken: WrappedTokenType = {
        tokenContract: "tzjredfrhgjkujrefd",
        tokenId: 5,
        chain: Chain.Tezos,
    };

    const dest = "tzERZH55TGHJHFGDS";

    const message: UnsignedMessageType = {
        status: Status.Locked,
        destination: dest,
        metadata: "",
        ...lockedToken,
    };

    const progress = () => {};

    it("should fail when destination addresses are empty", async () => {
        const hashi = new HashiBridge();

        await assert.isRejected(
            hashi.approveAndLock(Chain.Tezos, token, "", progress),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.bridge(Chain.Tezos, Chain.Ethereum, token, "", progress),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.unbridge(
                Chain.Tezos,
                Chain.Ethereum,
                lockedToken,
                "",
                progress
            ),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.burnToken(Chain.Tezos, lockedToken, "", progress),
            EmptyDestinationAddressError
        );
    });

    it("should fail when no signer is set for chain", async () => {
        const bridge = new HashiBridge();

        await assert.isRejected(
            bridge.approveAndLock(Chain.Tezos, token, dest, progress),
            NoSignerForChainError
        );

        message.status = Status.Locked;
        await assert.isRejected(
            bridge.wrapToken(Chain.Tezos, message, [], progress),
            NoSignerForChainError
        );

        await assert.isRejected(
            bridge.burnToken(Chain.Tezos, lockedToken, dest, progress),
            NoSignerForChainError
        );

        message.status = Status.Burned;
        await assert.isRejected(
            bridge.withdrawToken(Chain.Tezos, message, [], progress),
            NoSignerForChainError
        );

        await assert.isRejected(
            bridge.getLockedTokenFromWrapped(wrappedToken),
            NoSignerForChainError
        );
    });
});