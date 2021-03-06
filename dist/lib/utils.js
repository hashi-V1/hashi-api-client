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
exports.isMillisTimestamp = exports.isNotEmpty = exports.hasOwnProperty = exports.hexToString = exports.stringToHex = exports.setProgressCallback = void 0;
var progress_1 = require("./types/progress");
/**
 * Creates a non optional progressCallback with the parameter or if it is undefined
 * a default progress callback which prints the progress message to the console.
 * @param progressCallback an optional progress callback to use if non null
 * @returns a non optional progress callback (by default prints to console)
 */
function setProgressCallback(progressCallback) {
    var _this = this;
    return typeof progressCallback === "undefined"
        ? function (progress) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, console.log(progress_1.progressConstants[progress])];
        }); }); }
        : function (progress) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, progressCallback(progress)];
        }); }); };
}
exports.setProgressCallback = setProgressCallback;
/**
 * Transforms a text from ascii to hex.
 * @param input An Ascii string
 * @returns an hexadecimal representation of the input
 */
function stringToHex(input) {
    var ret = "";
    for (var i = 0; i < input.length; i++) {
        ret += input.charCodeAt(i).toString(16);
    }
    return ret;
}
exports.stringToHex = stringToHex;
/**
 * Transforms text from hex to ascii.
 * @param input An Hex string
 * @returns The Ascii representation of the hex input
 */
function hexToString(input) {
    var ret = "";
    for (var n = 0; n < input.length; n += 2) {
        ret += String.fromCharCode(parseInt(input.substring(n, n + 2), 16));
    }
    return ret;
}
exports.hexToString = hexToString;
/**
 * Check whether the object obj has a property called prop.
 * @param obj Any object
 * @param prop A property
 * @returns a boolean and a type predicate
 */
function hasOwnProperty(obj, prop) {
    return obj != null && obj.hasOwnProperty(prop);
}
exports.hasOwnProperty = hasOwnProperty;
/**
 * Check whether the input is of type string.
 * @param input Any object
 * @returns a boolean and a type predicate
 */
function isNotEmpty(input) {
    return input != null && input !== "";
}
exports.isNotEmpty = isNotEmpty;
/**
 * Check whether the input timestamp is in milliseconds.
 * @param timestamp any timestamp
 * @returns a boolean
 */
function isMillisTimestamp(timestamp) {
    return !isNaN(timestamp) && timestamp > 1000000000000;
}
exports.isMillisTimestamp = isMillisTimestamp;
//# sourceMappingURL=utils.js.map