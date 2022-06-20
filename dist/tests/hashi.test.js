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
var chai_1 = require("chai");
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var config_1 = require("../lib/config");
var hashi_1 = require("../lib/hashi");
var chain_1 = require("../lib/types/chain");
var errors_1 = require("../lib/types/errors");
var proof_1 = require("../lib/types/proof");
var token_1 = require("../lib/types/token");
(0, chai_1.use)(chai_as_promised_1.default);
describe("HashiBridge", function () {
    var token = (0, token_1.tokenFromAddressAndId)(config_1.chainConfig[chain_1.Chain.Ethereum].wrapperContract, 5, chain_1.Chain.Ethereum);
    var dest = "tzERZH55TGHJHFGDS";
    var message = {
        status: proof_1.Status.Locked,
        destination: dest,
        metadata: "",
        tokenContract: "tzjredfrhgjkujrefd",
        tokenId: 5,
        timestamp: 1647745387000,
    };
    var progress = function () { };
    it("should fail when destination addresses are empty", function () { return __awaiter(void 0, void 0, void 0, function () {
        var hashi;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hashi = new hashi_1.HashiBridge();
                    return [4 /*yield*/, chai_1.assert.isRejected(hashi.approveAndLock(token, "", chain_1.Chain.Ethereum, progress), errors_1.EmptyDestinationAddressError)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, chai_1.assert.isRejected(hashi.bridge(chain_1.Chain.Ethereum, token, "", progress), errors_1.EmptyDestinationAddressError)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, chai_1.assert.isRejected(hashi.unbridge(chain_1.Chain.Ethereum, token, "", progress), errors_1.EmptyDestinationAddressError)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, chai_1.assert.isRejected(hashi.burnToken(token, "", progress), errors_1.EmptyDestinationAddressError)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should fail when no signer is set for chain", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bridge;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bridge = new hashi_1.HashiBridge();
                    return [4 /*yield*/, chai_1.assert.isRejected(bridge.approveAndLock(token, dest, chain_1.Chain.Ethereum, progress), errors_1.NoSignerForChainError)];
                case 1:
                    _a.sent();
                    message.status = proof_1.Status.Locked;
                    return [4 /*yield*/, chai_1.assert.isRejected(bridge.wrapToken(chain_1.Chain.Tezos, message, [], progress), errors_1.NoSignerForChainError)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, chai_1.assert.isRejected(bridge.burnToken(token, dest, progress), errors_1.NoSignerForChainError)];
                case 3:
                    _a.sent();
                    message.status = proof_1.Status.Burned;
                    return [4 /*yield*/, chai_1.assert.isRejected(bridge.withdrawToken(chain_1.Chain.Tezos, message, [], progress), errors_1.NoSignerForChainError)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, chai_1.assert.isRejected(bridge.getLockedTokenFromWrapped(token), errors_1.NoSignerForChainError)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=hashi.test.js.map