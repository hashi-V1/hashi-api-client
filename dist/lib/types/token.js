"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenWrapped = exports.tokenFromAddressAndId = exports.isToken = exports.isLockedTokenType = void 0;
var config_1 = require("../config");
var utils_1 = require("../utils");
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
        (0, utils_1.isMillisTimestamp)(m.timestamp));
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
        chain: chain,
        uid: "".concat(tokenContract, "-").concat(tokenId),
        wrapped: isTokenWrapped(tokenContract, chain),
    };
}
exports.tokenFromAddressAndId = tokenFromAddressAndId;
/**
 * Checks whether the token's contract is a wrapper
 * @param tokenContract The token's contract address
 * @param chain The current chain of the token
 * @returns a boolean
 */
function isTokenWrapped(tokenContract, chain) {
    return config_1.chainConfig[chain].wrapperContract === tokenContract;
}
exports.isTokenWrapped = isTokenWrapped;
//# sourceMappingURL=token.js.map