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
exports.getLockedTokenEthereum = exports.withdrawTokenEthereum = exports.burnTokenEthereum = exports.wrapTokenEthereum = exports.approveAndLockEthereum = exports.setChainSignerEthereum = void 0;
var ethers_1 = require("ethers");
var ERC721_json_1 = __importDefault(require("../abi/ethereum/ERC721.json"));
var Locker_json_1 = __importDefault(require("../abi/ethereum/Locker.json"));
var Wrapper_json_1 = __importDefault(require("../abi/ethereum/Wrapper.json"));
var config_1 = require("../config");
var progress_1 = require("../types/progress");
/**
 * Sets the instance for the ethereum signer
 * @param chain The signer's current chain (used to know whether we are using a testnet or the mainnet)
 * @param signer The ethereum Signer (from ethers.js)
 * @returns The instance for this chain
 */
function setChainSignerEthereum(chain, signer) {
    return signer;
}
exports.setChainSignerEthereum = setChainSignerEthereum;
/**
 * Approves and locks at the same time a token on an Ethereum network.
 * @param token The token that will be locked
 * @param destinationAddress The addres on the target chain that will be receiving the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a promise with the token's lock timestamp
 */
function approveAndLockEthereum(token, destinationAddress, signer, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var lockerContract, tokenContract, approveTx, lockTx, confirm, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lockerContract = new ethers_1.Contract(config_1.chainConfig[token.chain].lockerContract, Locker_json_1.default, signer);
                    tokenContract = new ethers_1.Contract(token.tokenContract, ERC721_json_1.default, signer);
                    setProgress(progress_1.Progress.WaitingForUserApproval);
                    return [4 /*yield*/, tokenContract.approve(config_1.chainConfig[token.chain].lockerContract, token.tokenId)];
                case 1:
                    approveTx = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationApproval);
                    return [4 /*yield*/, approveTx.wait()];
                case 2:
                    _a.sent();
                    setProgress(progress_1.Progress.WaitingForUserLock);
                    return [4 /*yield*/, lockerContract.lock(token.tokenContract, token.tokenId, destinationAddress)];
                case 3:
                    lockTx = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationLock);
                    return [4 /*yield*/, lockTx.wait()];
                case 4:
                    confirm = _a.sent();
                    return [4 /*yield*/, signer.provider.getBlock(confirm.blockNumber)];
                case 5:
                    block = _a.sent();
                    return [2 /*return*/, block.timestamp * 1000];
            }
        });
    });
}
exports.approveAndLockEthereum = approveAndLockEthereum;
/**
 * Wraps a token on a specific chain with proofs from the federation.
 * @param chain The wrapping chain
 * @param message The unsigned message returned by the nodes
 * @param signatures The signature of the message
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns a wrapped token
 */
function wrapTokenEthereum(chain, message, signatures, signer, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperContract, wrapTx, tokenId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapperContract = new ethers_1.Contract(config_1.chainConfig[chain].wrapperContract, Wrapper_json_1.default, signer);
                    setProgress(progress_1.Progress.WaitingForUserWrap);
                    return [4 /*yield*/, wrapperContract.wrap(message.tokenContract, message.tokenId, message.timestamp, message.metadata, signatures.map(function (signature) { return signature.publicKey; }), signatures.map(function (signature) { return signature.sig; }))];
                case 1:
                    wrapTx = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationWrap);
                    return [4 /*yield*/, wrapTx.wait()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, wrapperContract.wrappedTokens(message.tokenContract, message.tokenId)];
                case 3:
                    tokenId = _a.sent();
                    if (isNaN(tokenId) || tokenId === 0)
                        return [2 /*return*/, Promise.reject("Failed to retrieve token id.")];
                    return [2 /*return*/, {
                            tokenContract: wrapperContract.address,
                            tokenId: tokenId,
                            chain: chain,
                        }];
            }
        });
    });
}
exports.wrapTokenEthereum = wrapTokenEthereum;
/**
 * Burn a wrapped token to transfer it to another chain
 * @param chain The chain where the token is currently wrapped
 * @param token The wrapped token to burn
 * @param destinationAddress The address on the target chain that will receive the token
 * @param signer The ethers.js signer created by setChainSignerEthereum
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function burnTokenEthereum(chain, token, destinationAddress, signer, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperContract, burnTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapperContract = new ethers_1.Contract(config_1.chainConfig[chain].wrapperContract, Wrapper_json_1.default, signer);
                    setProgress(progress_1.Progress.WaitingForUserBurn);
                    return [4 /*yield*/, wrapperContract.burn(token.tokenContract, token.tokenId, token.timestamp, destinationAddress)];
                case 1:
                    burnTx = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationBurn);
                    return [4 /*yield*/, burnTx.wait()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.burnTokenEthereum = burnTokenEthereum;
/**
 * Withdraws a token on an Ethereum chain (sends back the initial token before the lock)
 * @param chain The initial chain of the token
 * @param message An unsigned message sent by the nodes
 * @param signatures signatures returned by the nodes proving the message
 * @param signer The signer instance from ethers.js
 * @param setProgress optional callback to track the progress
 * @returns an empty promise
 */
function withdrawTokenEthereum(chain, message, signatures, signer, setProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var lockerContract, withdrawTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lockerContract = new ethers_1.Contract(config_1.chainConfig[chain].lockerContract, Locker_json_1.default, signer);
                    setProgress(progress_1.Progress.WaitingForUserWithdraw);
                    return [4 /*yield*/, lockerContract.withdraw(message.tokenContract, message.tokenId, message.timestamp, [], [])];
                case 1:
                    withdrawTx = _a.sent();
                    setProgress(progress_1.Progress.WaitingForConfirmationWithdraw);
                    return [4 /*yield*/, withdrawTx.wait()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.withdrawTokenEthereum = withdrawTokenEthereum;
function getLockedTokenEthereum(wrapped, signer) {
    return __awaiter(this, void 0, void 0, function () {
        var wrapperContract, val;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wrapperContract = new ethers_1.Contract(config_1.chainConfig[wrapped.chain].wrapperContract, Wrapper_json_1.default, signer);
                    return [4 /*yield*/, wrapperContract.wrappedId(wrapped.tokenId)];
                case 1:
                    val = _a.sent();
                    if (val.tokenContract == null ||
                        val.tokenContract === "" ||
                        !ethers_1.BigNumber.isBigNumber(val.tokenId) ||
                        !ethers_1.BigNumber.isBigNumber(val.tokenLockTimestamp))
                        return [2 /*return*/, Promise.reject("Could not retrieve wrapped token")];
                    return [2 /*return*/, {
                            tokenContract: val.tokenContract,
                            tokenId: val.tokenId.toNumber(),
                            timestamp: val.tokenLockTimestamp.toNumber(),
                        }];
            }
        });
    });
}
exports.getLockedTokenEthereum = getLockedTokenEthereum;
//# sourceMappingURL=ethereum.js.map