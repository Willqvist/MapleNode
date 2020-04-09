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
const fs_1 = __importDefault(require("fs"));
class MNHandler {
    saveMysql(data) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            let string = JSON.stringify(data);
            let exists = yield this.checkForFile("settings/database.MN");
            fs_1.default.writeFile("settings/database.MN", string, (err) => {
                resolve(err);
            });
        }));
    }
    isDatabaseSetup() {
        return new Promise((resolve, reject) => {
            fs_1.default.access("settings/database.MN", fs_1.default.constants.F_OK, (err) => {
                if (err)
                    reject(err);
                resolve(true);
            });
        });
    }
    getMysql(path) {
        return new Promise(resolve => {
            fs_1.default.readFile(path, "utf8", (err, data) => {
                resolve(JSON.parse(data));
            });
        });
    }
    checkForFile(fileName) {
        return new Promise((resolve, reject) => {
            if (!fs_1.default.existsSync("settings")) {
                fs_1.default.mkdirSync("settings");
            }
            fs_1.default.access("settings", fs_1.default.constants.F_OK, (err) => {
                if (err) {
                    fs_1.default.mkdirSync("settings");
                }
                fs_1.default.access(fileName, fs_1.default.constants.F_OK, (err) => {
                    if (!err) {
                        resolve(true);
                    }
                    else {
                        fs_1.default.writeFile(fileName, "", (data) => {
                            if (err)
                                resolve(false);
                            resolve(true);
                        });
                    }
                });
            });
        });
    }
}
exports.default = MNHandler;
module.exports = new MNHandler();
//# sourceMappingURL=MNHandler.js.map