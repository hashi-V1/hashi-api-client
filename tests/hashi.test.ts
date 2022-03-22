import { assert, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { HashiBridge } from "../lib/hashi";
import { Chain } from "../lib/types/chain";
import {
    EmptyDestinationAddressError,
    NoSignerForChainError,
} from "../lib/types/errors";
import { Status, UnsignedMessageType } from "../lib/types/proof";
import { Token, tokenFromAddressAndId } from "../lib/types/token";
use(chaiAsPromised);

describe("HashiBridge", () => {
    const token: Token = tokenFromAddressAndId(
        "tzjredfrhgjkujrefd",
        5,
        Chain.Ethereum
    );

    const dest = "tzERZH55TGHJHFGDS";

    const message: UnsignedMessageType = {
        status: Status.Locked,
        destination: dest,
        metadata: "",
        tokenContract: "tzjredfrhgjkujrefd",
        tokenId: 5,
        timestamp: 1647745387000,
    };

    const progress = () => {};

    it("should fail when destination addresses are empty", async () => {
        const hashi = new HashiBridge();

        await assert.isRejected(
            hashi.approveAndLock(token, "", progress),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.bridge(Chain.Ethereum, token, "", progress),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.unbridge(Chain.Ethereum, token, "", progress),
            EmptyDestinationAddressError
        );

        await assert.isRejected(
            hashi.burnToken(token, "", progress),
            EmptyDestinationAddressError
        );
    });

    it("should fail when no signer is set for chain", async () => {
        const bridge = new HashiBridge();

        await assert.isRejected(
            bridge.approveAndLock(token, dest, progress),
            NoSignerForChainError
        );

        message.status = Status.Locked;
        await assert.isRejected(
            bridge.wrapToken(Chain.Tezos, message, [], progress),
            NoSignerForChainError
        );

        await assert.isRejected(
            bridge.burnToken(token, dest, progress),
            NoSignerForChainError
        );

        message.status = Status.Burned;
        await assert.isRejected(
            bridge.withdrawToken(Chain.Tezos, message, [], progress),
            NoSignerForChainError
        );

        await assert.isRejected(
            bridge.getLockedTokenFromWrapped(token),
            NoSignerForChainError
        );
    });
});
