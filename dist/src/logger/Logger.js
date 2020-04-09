"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static setLogger(logger) {
        Logger.logger = logger;
    }
    static log(msg) {
        Logger.logger.log(msg);
    }
    static error(msg) {
        Logger.logger.error(msg);
    }
    static warn(msg) {
        Logger.logger.warn(msg);
    }
    static info(msg) {
        Logger.logger.info(msg);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map