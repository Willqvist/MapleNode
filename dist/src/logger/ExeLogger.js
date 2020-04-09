"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Time_1 = __importDefault(require("../tools/Time"));
const Logger_1 = __importDefault(require("./Logger"));
class ExeLogger extends Logger_1.default {
    log(msg) {
        console.log(`[${Time_1.default.getTime()} LOG]     : ${msg}`);
    }
    error(msg) {
        console.log(`[${Time_1.default.getTime()} ERROR]   : ${msg}`);
    }
    info(msg) {
        console.log(`[${Time_1.default.getTime()} INFO]    : ${msg}`);
    }
    warn(msg) {
        console.log(`[${Time_1.default.getTime()} WARNING] : ${msg}`);
    }
}
exports.default = ExeLogger;
//# sourceMappingURL=ExeLogger.js.map