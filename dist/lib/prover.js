"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveTokenStatus = void 0;
var nodes = ["http://localhost:3030/proof", "http://localhost:3030/proof"];
var axios_1 = __importDefault(require("axios"));
var proof_1 = require("./types/proof");
/**
 * Prove a token status with the federation
 * @param sourceChain The chain where the token went throught the status
 * @param targetChain The chain where the proof will be used
 * @param token The locked token (contract address, id and timestamp)
 * @param status The status that should be proved
 * @param progressCallback A callback to get the progress of the proof
 * @returns a promise with the message and signatures
 */
function proveTokenStatus(sourceChain, targetChain, token, status, progressCallback) {
    var proofRequest = __assign({ sourceChain: sourceChain, targetChain: targetChain, status: status }, token);
    var signatures = [];
    var promises = [];
    var message;
    nodes.forEach(function (node) {
        promises.push(axios_1.default
            .get(node, {
            params: proofRequest,
        })
            .then(function (response) {
            var signedMessage = response.data;
            if (!(0, proof_1.isSignedMessageType)(signedMessage)) {
                return Promise.reject("Wrong response type (not SignedMessageType)");
            }
            signatures.push(signedMessage.signature);
            if (typeof message === "undefined") {
                message = signedMessage;
            }
        }));
    });
    return Promise.all(promises).then(function () {
        if (typeof message === "undefined") {
            return Promise.reject("Undefined message");
        }
        return {
            signatures: signatures,
            message: message,
        };
    });
}
exports.proveTokenStatus = proveTokenStatus;
//# sourceMappingURL=prover.js.map