"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenFromAddressAndId = exports.isToken = exports.isLockedTokenType = void 0;
var chain_1 = require("./chain");
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
function isLockedTokenType(input) {
    if (typeof input === "undefined" || input == null)
        return false;
    var m = input;
    return (m.tokenContract != null &&
        m.tokenContract != "" &&
        m.tokenId != null &&
        !isNaN(m.tokenId) &&
        m.timestamp != null &&
        !isNaN(m.timestamp));
}
exports.isLockedTokenType = isLockedTokenType;
function isToken(input) {
    if (typeof input === "undefined" || input == null)
        return false;
    var token = input;
    return (token.tokenContract != null &&
        token.tokenContract != "" &&
        token.tokenId != null &&
        !isNaN(token.tokenId) &&
        token.uid != null &&
        token.uid != "" &&
        (0, chain_1.isChain)(token.chain));
}
exports.isToken = isToken;
/**
 * Creates a token object from its contract address and id and its chain.
 * @param tokenContract
 * @param tokenId
 * @param chain
 * @returns a Token
 */
function tokenFromAddressAndId(tokenContract, tokenId, chain, wrapped) {
    if (wrapped === void 0) { wrapped = false; }
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
        chain: chain,
        uid: "".concat(tokenContract, "-").concat(tokenId),
        wrapped: wrapped,
    };
}
exports.tokenFromAddressAndId = tokenFromAddressAndId;
//# sourceMappingURL=token.js.map