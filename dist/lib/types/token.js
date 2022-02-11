"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenFromAddressAndId = exports.isLockedTokenType = void 0;
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
    return {
        tokenContract: tokenContract,
        tokenId: tokenId,
        currentChain: chain,
        initialChain: chain,
    };
}
exports.tokenFromAddressAndId = tokenFromAddressAndId;
//# sourceMappingURL=token.js.map