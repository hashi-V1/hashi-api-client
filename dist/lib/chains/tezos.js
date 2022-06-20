"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedTokenFromWrappedTezos = exports.withdrawTokenTezos = exports.burnTokenTezos = exports.wrapTokenTezos = exports.approveAndLockTezos = exports.setChainSignerTezos = void 0;
var taquito_1 = require("@taquito/taquito");
var config_1 = require("../config");
var progress_1 = require("../types/progress");
var utils_1 = require("../utils");
/**
 * Checks whether the TezosSigner is a WalletProvider instead of a Signer
 * @param signer a TezosSigner signer
 * @returns a boolean and a type predicate
 */
function tezosSignerIsWalletProvider(signer) {
    return (typeof signer === "object" &&
        "getPKH" in signer &&
        "mapTransferParamsToWalletParams" in signer &&
        "mapOriginateParamsToWalletParams" in signer &&
        "mapDelegateParamsToWalletParams" in signer &&
        "sendOperations" in signer);
}
/**
 * Creates a TezosToolkit instance with the giver signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer the corresponding signer (wallet or inMemorySigner)
 * @returns The TezosToolkit instance
 */
function setChainSignerTezos(chain, signer) {
    var Tezos = new taquito_1.TezosToolkit(config_1.chainConfig[chain].rpc);
    if (tezosSignerIsWalletProvider(signer)) {
        Tezos.setWalletProvider(signer);
    }
    else {
        Tezos.setSignerProvider(signer);
    }
    return Tezos;
}
exports.setChainSignerTezos = setChainSignerTezos;
/**
 * Convert an array of Signatures to a MichelsonMap
 * @param signatures an array of Signature(s)
 * @returns a MichelsonMap with the public key as key and sig as value
 */
function signatureArrayToMichelsonMap(signatures) {
    var map = new taquito_1.MichelsonMap();
    signatures.forEach(function (signature) {
        return map.set(signature.publicKey, signature.sig);
    });
    return map;
}
/**
 * Approves and locks at the same time a token on a Tezos network.
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param destinationChain The target Chain
 * @param setProgress optional callback to track the progress
 * @param Tezos The TezosToolkit instance corresponding to that chain
 */
function approveAndLockTezos(token, destinationAddress, destinationChain, Tezos, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var signerAddress, lockerContract, tokenContract, operation, confirmation, lockerStorage, timestamp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Tezos.wallet.pkh()];
                case 1:
                    signerAddress = _a.sent();
                    return [4 /*yield*/, Tezos.wallet.at(config_1.chainConfig[token.chain].lockerContract)];
                case 2:
                    lockerContract = _a.sent();
                    return [4 /*yield*/, Tezos.wallet.at(token.tokenContract)];
                case 3:
                    tokenContract = _a.sent();
                    setProgress(progress_1.Progress.WaitingForUserApproval);
                    setProgress(progress_1.Progress.WaitingForUserLock);
                    return [4 /*yield*/, Tezos.wallet
                            .batch()
                            .withContractCall(tokenContract.methods.update_operators([
                            {
                                add_operator: {
                                    owner: signerAddress,
                                    operator: lockerContract.address,
                                    token_id: token.tokenId,
                                },
                            },
                        ]))
                            .withContractCall(lockerContract.methodsObject.lock({
                            destination_address: destinationAddress,
                            destination_chain: config_1.chainConfig[destinationChain].id,
                            token_contract: token.tokenContract,
                            token_id: token.tokenId.toString(),
                        }))
                            .send()];
                case 4:
                    operation = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationApproval);
                    setProgress(progress_1.Progress.WaitingForConfirmationLock);
                    return [4 /*yield*/, operation.confirmation()];
                case 5:
                    confirmation = _a.sent();
                    if (!confirmation.completed)
                        return [2 /*return*/, Promise.reject("Transaction not completed")];
                    return [4 /*yield*/, lockerContract.storage()];
                case 6:
                    lockerStorage = _a.sent();
                    timestamp = lockerStorage.lock_timestamps.get({
                        token_contract: token.tokenContract,
                        token_id: token.tokenId.toString(),
                    });
                    return [2 /*return*/, {
                            hashes: [operation.opHash],
                            data: Date.parse(timestamp),
                        }];
            }
        });
    });
}
exports.approveAndLockTezos = approveAndLockTezos;
/**
 * Wraps a token on a specific chain with proofs from the federation.
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
function wrapTokenTezos(chain, message, signatures, Tezos, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperContract, operation, confirmation, wrapperStorage, tokenId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Tezos.wallet.at(config_1.chainConfig[chain].wrapperContract)];
                case 1:
                    wrapperContract = _a.sent();
                    setProgress(progress_1.Progress.WaitingForUserWrap);
                    return [4 /*yield*/, wrapperContract.methodsObject
                            .mint({
                            token_contract: message.tokenContract,
                            token_id: message.tokenId.toString(),
                            lock_timestamp: new Date(message.timestamp).toISOString(),
                            metadata: (0, utils_1.stringToHex)(message.metadata),
                            signatures: signatureArrayToMichelsonMap(signatures),
                        })
                            .send()];
                case 2:
                    operation = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationWrap);
                    return [4 /*yield*/, operation.confirmation()];
                case 3:
                    confirmation = _a.sent();
                    if (!confirmation.completed)
                        return [2 /*return*/, Promise.reject("Transaction not completed")];
                    return [4 /*yield*/, wrapperContract.storage()];
                case 4:
                    wrapperStorage = _a.sent();
                    if (wrapperStorage === null ||
                        typeof wrapperStorage !== "object" ||
                        !(0, utils_1.hasOwnProperty)(wrapperStorage, "wrapped_tokens") ||
                        !taquito_1.MichelsonMap.isMichelsonMap(wrapperStorage.wrapped_tokens))
                        return [2 /*return*/, Promise.reject("Invalid wrapper storage")];
                    tokenId = parseInt(wrapperStorage.wrapped_tokens.get({
                        token_contract: message.tokenContract,
                        token_id: message.tokenId.toString(),
                    }));
                    if (isNaN(tokenId))
                        return [2 /*return*/, Promise.reject("Could not retrieve wrapped token id")];
                    return [2 /*return*/, {
                            hashes: [operation.opHash],
                            data: {
                                tokenContract: config_1.chainConfig[chain].wrapperContract,
                                tokenId: tokenId,
                                chain: chain,
                            },
                        }];
            }
        });
    });
}
exports.wrapTokenTezos = wrapTokenTezos;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param Tezos The TezosToolkit instance from setChainSignerTezos
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function burnTokenTezos(token, destinationAddress, Tezos, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperContract, operation, confirmation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Tezos.wallet.at(config_1.chainConfig[token.chain].wrapperContract)];
                case 1:
                    wrapperContract = _a.sent();
                    setProgress(progress_1.Progress.WaitingForUserBurn);
                    return [4 /*yield*/, wrapperContract.methodsObject
                            .burn({
                            destination_address: destinationAddress,
                            wrapped_id: token.tokenId.toString(),
                        })
                            .send()];
                case 2:
                    operation = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationBurn);
                    return [4 /*yield*/, operation.confirmation()];
                case 3:
                    confirmation = _a.sent();
                    if (!confirmation.completed)
                        return [2 /*return*/, Promise.reject("Could not burn")];
                    return [2 /*return*/, {
                            hashes: [operation.opHash],
                            data: undefined,
                        }];
            }
        });
    });
}
exports.burnTokenTezos = burnTokenTezos;
/**
 * Withdraws a token on a Tezos chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param Tezos The TezosToolkit instance
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function withdrawTokenTezos(chain, message, signatures, Tezos, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var lockerContract, op, confirm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Tezos.wallet.at(config_1.chainConfig[chain].lockerContract)];
                case 1:
                    lockerContract = _a.sent();
                    setProgress(progress_1.Progress.WaitingForUserWithdraw);
                    return [4 /*yield*/, lockerContract.methodsObject
                            .withdraw({
                            token_contract: message.tokenContract,
                            token_id: message.tokenId.toString(),
                            lock_timestamp: new Date(message.timestamp).toISOString(),
                            signatures: new taquito_1.MichelsonMap(),
                        })
                            .send()];
                case 2:
                    op = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationWithdraw);
                    return [4 /*yield*/, op.confirmation()];
                case 3:
                    confirm = _a.sent();
                    if (!confirm.completed)
                        return [2 /*return*/, Promise.reject("Could not withdraw")];
                    return [2 /*return*/, {
                            hashes: [op.opHash],
                            data: undefined,
                        }];
            }
        });
    });
}
exports.withdrawTokenTezos = withdrawTokenTezos;
function getLockedTokenFromWrappedTezos(chain, wrappedId, Tezos) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperAddress, wrapperContract, value;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapperAddress = config_1.chainConfig[chain].wrapperContract;
                    return [4 /*yield*/, Tezos.contract.at(wrapperAddress)];
                case 1:
                    wrapperContract = _a.sent();
                    return [4 /*yield*/, wrapperContract.contractViews
                            .getWrappedinfos(wrappedId)
                            .executeView({
                            source: wrapperAddress,
                            viewCaller: wrapperAddress,
                        })];
                case 2:
                    value = _a.sent();
                    if (!value ||
                        !value.token_id ||
                        !value.lock_timestamp ||
                        !value.token_contract ||
                        isNaN(value.token_id.toNumber()) ||
                        isNaN(Date.parse(value.lock_timestamp)))
                        return [2 /*return*/, Promise.reject("Could not retrieve wrapped token")];
                    return [2 /*return*/, {
                            tokenId: value.token_id.toNumber(),
                            tokenContract: value.token_contract,
                            timestamp: Date.parse(value.lock_timestamp),
                        }];
            }
        });
    });
}
exports.getLockedTokenFromWrappedTezos = getLockedTokenFromWrappedTezos;
//# sourceMappingURL=tezos.js.map