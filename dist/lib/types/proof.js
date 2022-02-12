"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSignedMessageType = exports.isUnsignedMessageType = exports.isProofRequestType = exports.Status = void 0;
var chain_1 = require("./chain");
var token_1 = require("./token");
/**
 * Represents the status of the signature whether it proves the token
 * has been locked or burned.
 */
var Status;
(function (Status) {
    Status["Locked"] = "locked";
    Status["Burned"] = "burned";
})(Status = exports.Status || (exports.Status = {}));
/**
 * Checks whether the input is of the ProofRequestType
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
function isProofRequestType(input) {
    var p = input;
    return ((0, token_1.isLockedTokenType)(p) &&
        Object.values(Status).includes(p.status) &&
        Object.values(chain_1.Chain).includes(p.sourceChain) &&
        Object.values(chain_1.Chain).includes(p.targetChain));
}
exports.isProofRequestType = isProofRequestType;
/**
 * Checks whether the input is of the UnsignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
function isUnsignedMessageType(input) {
    var m = input;
    return ((0, token_1.isLockedTokenType)(m) &&
        m.destination != null &&
        m.destination != "" &&
        m.metadata != null &&
        Object.values(Status).includes(m.status));
}
exports.isUnsignedMessageType = isUnsignedMessageType;
/**
 * Checks whether the input is of the SignedMessageType type.
 * @param input Any input
 * @returns a boolean and a type predicate.
 */
function isSignedMessageType(input) {
    var m = input;
    return isUnsignedMessageType(m) && m.signature != null && m.signature != "";
}
exports.isSignedMessageType = isSignedMessageType;
//# sourceMappingURL=proof.js.map