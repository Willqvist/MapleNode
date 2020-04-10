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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("./src/database/DatabaseConnection"));
const MysqlDatabase_1 = require("./src/database/MysqlDatabase");
const MNHandler_1 = __importDefault(require("./src/tools/MNHandler"));
const Logger_1 = __importDefault(require("./src/logger/Logger"));
function onStart() {
    return __awaiter(this, void 0, void 0, function* () {
        let exists = yield MNHandler_1.default.isDatabaseSetup();
        if (exists) {
            try {
                let data = yield MNHandler_1.default.getMysql("./settings/database.MN");
                let result = yield DatabaseConnection_1.default.createInstance(getDatabase(), data);
            }
            catch (err) {
                Logger_1.default.warn("Could not connected to database.");
                Logger_1.default.error(`[${err.errno}] ${err.msg}`);
                return false;
            }
        }
        return true;
    });
}
exports.onStart = onStart;
function getDatabase() {
    return new MysqlDatabase_1.MysqlDatabase();
}
exports.getDatabase = getDatabase;
function onEnd() {
}
exports.onEnd = onEnd;
//# sourceMappingURL=startup.js.map