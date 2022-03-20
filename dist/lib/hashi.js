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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashiBridge = void 0;
var axios_1 = __importDefault(require("axios"));
var ethereum_1 = require("./chains/ethereum");
var tezos_1 = require("./chains/tezos");
var config_1 = require("./config");
var prover_1 = require("./prover");
var chain_1 = require("./types/chain");
var errors_1 = require("./types/errors");
var progress_1 = require("./types/progress");
var proof_1 = require("./types/proof");
var utils_1 = require("./utils");
/**
 * Main class of the Hashi Protocol bridge.
 */
var HashiBridge = /** @class */ (function () {
    /**
     * Constructor
     */
    function HashiBridge() {
        this.chainsInstances = new Map();
    }
    /**
     * Saves the signer to use for a chain.
     * @param chain The signer's chain
     * @param signer The corresponding signer
     */
    HashiBridge.prototype.setChainSigner = function (chain, signer) {
        var setter;
        if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
            setter = tezos_1.setChainSignerTezos;
        else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
            setter = ethereum_1.setChainSignerEthereum;
        if (!setter)
            throw new Error("Unknown chain");
        this.chainsInstances.set(chain, setter(chain, signer));
    };
    /**
     * Approves and locks at the same time a token.
     * @param token The token that will be locked
     * @param destinationAddress The address that will receive the token on the target chain
     * @param progressCallback optional callback to track the progress
     */
    HashiBridge.prototype.approveAndLock = function (token, destinationAddress, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var chain, setProgress, approveAndLock, instance, timestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chain = token.chain;
                        if (destinationAddress === "")
                            return [2 /*return*/, Promise.reject(errors_1.EmptyDestinationAddressError)];
                        setProgress = (0, utils_1.setProgressCallback)(progressCallback);
                        setProgress(progress_1.Progress.ApprovingAndLocking);
                        if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
                            approveAndLock = tezos_1.approveAndLockTezos;
                        else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
                            approveAndLock = ethereum_1.approveAndLockEthereum;
                        if (!approveAndLock)
                            return [2 /*return*/, Promise.reject(errors_1.UnknownChain)];
                        instance = this.chainsInstances.get(chain);
                        if (typeof instance === "undefined")
                            return [2 /*return*/, Promise.reject(errors_1.NoSignerForChainError)];
                        return [4 /*yield*/, approveAndLock(token, destinationAddress, instance, setProgress)];
                    case 1:
                        timestamp = _a.sent();
                        setProgress(progress_1.Progress.ApprovedAndLocked);
                        return [2 /*return*/, {
                                tokenContract: token.tokenContract,
                                tokenId: token.tokenId,
                                timestamp: timestamp,
                            }];
                }
            });
        });
    };
    /**
     * Wrap a token with signatures from the federation
     * @param chain The wrapping chain
     * @param message The message returned by the nodes
     * @param signatures An array of signatures
     * @param progressCallback optional callback to track the progress
     * @returns a promise with a Wrapped token
     */
    HashiBridge.prototype.wrapToken = function (chain, message, signatures, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var setProgress, wrapToken, instance, wrappedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (message.status !== proof_1.Status.Locked)
                            return [2 /*return*/, Promise.reject(errors_1.CannotWrapWithStatusOtherThanLocked)];
                        setProgress = (0, utils_1.setProgressCallback)(progressCallback);
                        setProgress(progress_1.Progress.Wrapping);
                        if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
                            wrapToken = tezos_1.wrapTokenTezos;
                        else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
                            wrapToken = ethereum_1.wrapTokenEthereum;
                        if (!wrapToken)
                            return [2 /*return*/, Promise.reject(errors_1.UnknownChain)];
                        instance = this.chainsInstances.get(chain);
                        if (typeof instance === "undefined")
                            return [2 /*return*/, Promise.reject(errors_1.NoSignerForChainError)];
                        return [4 /*yield*/, wrapToken(chain, message, signatures, instance, setProgress)];
                    case 1:
                        wrappedToken = _a.sent();
                        setProgress(progress_1.Progress.Wrapped);
                        return [2 /*return*/, wrappedToken];
                }
            });
        });
    };
    /**
     * Bridges (transfers) a token from one chain to another
     * @param targetChain The chain where the token should be after the bridge
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the wrapped token
     * @param progressCallback optional callback to track the progress
     * @returns a promise with the wrapped token
     */
    HashiBridge.prototype.bridge = function (targetChain, token, destinationAddress, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var lockedToken, _a, signatures, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (destinationAddress === "")
                            return [2 /*return*/, Promise.reject(errors_1.EmptyDestinationAddressError)];
                        return [4 /*yield*/, this.approveAndLock(token, destinationAddress, progressCallback)];
                    case 1:
                        lockedToken = _b.sent();
                        return [4 /*yield*/, this.proveTokenStatus(token.chain, targetChain, lockedToken, proof_1.Status.Locked, progressCallback)];
                    case 2:
                        _a = _b.sent(), signatures = _a.signatures, message = _a.message;
                        return [2 /*return*/, this.wrapToken(targetChain, message, signatures, progressCallback)];
                }
            });
        });
    };
    /**
     * Unbridges a wrapped token (releases the initial token)
     * @param targetChain The token's initial chain
     * @param token The token to tranfer
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.unbridge = function (targetChain, token, destinationAddress, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var lockedToken, _a, signatures, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (destinationAddress === "")
                            return [2 /*return*/, Promise.reject(errors_1.EmptyDestinationAddressError)];
                        return [4 /*yield*/, this.burnToken(token, destinationAddress, progressCallback)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.getLockedToken(token)];
                    case 2:
                        lockedToken = _b.sent();
                        return [4 /*yield*/, this.proveTokenStatus(token.chain, targetChain, lockedToken, proof_1.Status.Burned, progressCallback)];
                    case 3:
                        _a = _b.sent(), signatures = _a.signatures, message = _a.message;
                        return [4 /*yield*/, this.withdrawToken(targetChain, message, signatures, progressCallback)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Collects proofs of a specific status from nodes.
     * @param sourceChain The chain where the status action took place (lock or burn)
     * @param targetChain The chain which will receive receive the signatures
     * @param token The token that went through the action
     * @param status The action we want to prove
     * @param progressCallback optional callback to track the progress
     * @returns a Promise with signatures and an UnsignedMessageType
     */
    HashiBridge.prototype.proveTokenStatus = function (sourceChain, targetChain, token, status, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var setProgress, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProgress = (0, utils_1.setProgressCallback)(progressCallback);
                        setProgress(progress_1.Progress.ProvingStatus);
                        return [4 /*yield*/, (0, prover_1.proveTokenStatus)(sourceChain, targetChain, token, status, setProgress)];
                    case 1:
                        value = _a.sent();
                        setProgress(progress_1.Progress.ProvedStatus);
                        return [2 /*return*/, value];
                }
            });
        });
    };
    /**
     * Burn a wrapped token to transfer it to another chain
     * @param token The wrapped token to burn
     * @param destinationAddress The address on the target chain that will receive the token
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.burnToken = function (token, destinationAddress, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var chain, setProgress, burnToken, instance, lockedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chain = token.chain;
                        if (destinationAddress === "")
                            return [2 /*return*/, Promise.reject(errors_1.EmptyDestinationAddressError)];
                        setProgress = (0, utils_1.setProgressCallback)(progressCallback);
                        setProgress(progress_1.Progress.Burning);
                        if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
                            burnToken = tezos_1.burnTokenTezos;
                        else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
                            burnToken = ethereum_1.burnTokenEthereum;
                        if (!burnToken)
                            return [2 /*return*/, Promise.reject(errors_1.UnknownChain)];
                        instance = this.chainsInstances.get(chain);
                        if (typeof instance === "undefined")
                            return [2 /*return*/, Promise.reject(errors_1.NoSignerForChainError)];
                        return [4 /*yield*/, this.getLockedToken(token)];
                    case 1:
                        lockedToken = _a.sent();
                        return [4 /*yield*/, burnToken(chain, lockedToken, destinationAddress, instance, setProgress)];
                    case 2:
                        _a.sent();
                        setProgress(progress_1.Progress.Burned);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Withdraws a token on a specific chain (sends back the initial token before the lock)
     * @param chain The initial chain of the token
     * @param message An unsigned message sent by the nodes
     * @param signatures signatures returned by the nodes proving the message
     * @param progressCallback optional callback to track the progress
     * @returns an empty promise
     */
    HashiBridge.prototype.withdrawToken = function (chain, message, signatures, progressCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var setProgress, withdrawToken, instance;
            return __generator(this, function (_a) {
                if (message.status !== proof_1.Status.Burned)
                    return [2 /*return*/, Promise.reject(errors_1.CannotWithdrawWithStatusOtherThanBurned)];
                setProgress = (0, utils_1.setProgressCallback)(progressCallback);
                setProgress(progress_1.Progress.Withdrawing);
                if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
                    withdrawToken = tezos_1.withdrawTokenTezos;
                else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
                    withdrawToken = ethereum_1.withdrawTokenEthereum;
                if (!withdrawToken)
                    return [2 /*return*/, Promise.reject(errors_1.UnknownChain)];
                instance = this.chainsInstances.get(chain);
                if (typeof instance === "undefined")
                    return [2 /*return*/, Promise.reject(errors_1.NoSignerForChainError)];
                return [2 /*return*/, withdrawToken(chain, message, signatures, instance, setProgress)];
            });
        });
    };
    HashiBridge.prototype.getLockedToken = function (wrapped) {
        return __awaiter(this, void 0, void 0, function () {
            var chain, getLocked, instance;
            return __generator(this, function (_a) {
                chain = wrapped.chain;
                if (chain === chain_1.Chain.Tezos || chain === chain_1.Chain.Hangzhounet)
                    getLocked = tezos_1.getLockedTokenTezos;
                else if (chain === chain_1.Chain.Ethereum || chain === chain_1.Chain.Ropsten)
                    getLocked = ethereum_1.getLockedTokenEthereum;
                if (!getLocked)
                    return [2 /*return*/, Promise.reject(errors_1.UnknownChain)];
                instance = this.chainsInstances.get(chain);
                if (typeof instance === "undefined") {
                    return [2 /*return*/, Promise.reject(errors_1.NoSignerForChainError)];
                }
                return [2 /*return*/, getLocked(wrapped, instance)];
            });
        });
    };
    HashiBridge.prototype.getTokensForAccount = function (chain, address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!config_1.hashiIndexerUrl)
                            return [2 /*return*/, []];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("".concat(config_1.hashiIndexerUrl, "/nftsForAccount"), {
                                params: {
                                    chain: chain,
                                    address: address,
                                },
                            })];
                    case 2:
                        response = _a.sent();
                        if (response.status !== 200)
                            return [2 /*return*/, Promise.reject(response.data)];
                        if (!response.data || !Array.isArray(response.data.data))
                            throw new Error(); // Indexer Error
                        return [2 /*return*/, response.data.data];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, Promise.reject("Indexer error")];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return HashiBridge;
}());
exports.HashiBridge = HashiBridge;
//# sourceMappingURL=hashi.js.map