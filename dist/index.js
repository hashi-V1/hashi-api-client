"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToHex = exports.isMillisTimestamp = exports.hexToString = exports.HashiBridge = void 0;
__exportStar(require("./lib/config"), exports);
var hashi_1 = require("./lib/hashi");
Object.defineProperty(exports, "HashiBridge", { enumerable: true, get: function () { return hashi_1.HashiBridge; } });
__exportStar(require("./lib/types/chain"), exports);
__exportStar(require("./lib/types/progress"), exports);
__exportStar(require("./lib/types/proof"), exports);
__exportStar(require("./lib/types/token"), exports);
var utils_1 = require("./lib/utils");
Object.defineProperty(exports, "hexToString", { enumerable: true, get: function () { return utils_1.hexToString; } });
Object.defineProperty(exports, "isMillisTimestamp", { enumerable: true, get: function () { return utils_1.isMillisTimestamp; } });
Object.defineProperty(exports, "stringToHex", { enumerable: true, get: function () { return utils_1.stringToHex; } });
//# sourceMappingURL=index.js.map