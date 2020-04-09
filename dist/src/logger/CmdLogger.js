"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("./Logger"));
class CmdLogger extends Logger_1.default {
    log(msg) {
        console.log(msg);
    }
    error(msg) {
        console.log("\x1b[31m" + msg + "\x1b[0m");
    }
    warn(msg) {
        console.log("\x1b[33m" + msg + "\x1b[0m");
    }
    info(msg) {
        console.log(msg);
    }
}
exports.default = CmdLogger;
//# sourceMappingURL=CmdLogger.js.map