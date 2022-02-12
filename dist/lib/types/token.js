"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenFromAddressAndId = exports.isLockedTokenType = void 0;
var chain_1 = require("./chain");
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
function isLockedTokenType(input) {
    var m = input;
    return (m.tokenContract != null &&
        m.tokenContract != "" &&
        m.tokenId != null &&
        !isNaN(m.tokenId) &&
        m.timestamp != null &&
        !isNaN(m.timestamp));
}
exports.isLockedTokenType = isLockedTokenType;
/**
 * Creates a token object from its contract address and id and its chain.
 * TODO Implement something to retrieve the real state of the token (initial and current chains);
 * @param tokenContract
 * @param tokenId
 * @param chain
 * @returns a Token
 */
function tokenFromAddressAndId(tokenContract, tokenId, chain) {
    if (tokenContract === "") {
        throw new Error("tokenContract cannot be empty to build a token.");
    }
    if (isNaN(tokenId)) {
        throw new Error("tokenId must be a valid integer to build a token.");
    }
    if (!(0, chain_1.isChain)(chain)) {
        throw new Error("chain is not a valid Chain to build a token.");
    }
    return {
        tokenContract: tokenContract,
        tokenId: tokenId,
        currentChain: chain,
        initialChain: chain,
    };
}
exports.tokenFromAddressAndId = tokenFromAddressAndId;
//# sourceMappingURL=token.js.map