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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const constants = __importStar(require("./Constants"));
const DatabaseConnection_1 = __importDefault(require("../database/DatabaseConnection"));
const Paths_1 = require("../../Paths");
;
class InstallationHandler {
    installationComplete(src) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs.access(Paths_1.HOME + src, fs.constants.F_OK, (err) => {
                    let data = {
                        done: false,
                        mysqlSetupComplete: false,
                    };
                    if (!err) {
                        fs.readFile(Paths_1.HOME + src, "utf8", (err, text) => {
                            data = JSON.parse(text);
                            let ret = {
                                mysqlSetupComplete: data.mysqlSetupComplete,
                                prefix: data.prefix,
                                done: data.done
                            };
                            resolve(ret);
                        });
                    }
                    else {
                        fs.writeFile(Paths_1.HOME + src, JSON.stringify(data), { flag: 'wx' }, (err) => {
                            if (err)
                                reject(err);
                            resolve(data);
                        });
                    }
                });
            });
        });
    }
    setMysqlSetupComplete(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = {};
            data.mysqlSetupComplete = true;
            data.prefix = userData.prefix;
            constants.setConstant("prefix", userData.prefix);
            console.log("stop that fear!");
            yield DatabaseConnection_1.default.instance.rebuildDatabase(data.prefix);
            yield DatabaseConnection_1.default.instance.addPalette('Happy Green', '#69DC9E', '#3E78B2', '#D3F3EE', '#20063B', '#CC3363', 1);
            yield DatabaseConnection_1.default.instance.addDesign('headerImage.png', 'svgs/logo.svg');
            yield DatabaseConnection_1.default.instance.updateLayout('home', '{"0":{"name":"info_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":1,"size":6}},"1":{"name":"control_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":1,"size":4}},"2":{"name":"news_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":6,"size":8}},"3":{"name":"server_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":4,"size":8}},"4":{"name":"stats_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":8,"size":10}},"5":{"name":"ranking_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":10,"size":14}}}');
            let paletteInterface = {
                name: 'Happy Green',
                mainColor: '#69DC9E',
                secondaryMainColor: '#3E78B2',
                fontColorLight: '#D3F3EE',
                fontColorDark: '#20063B',
                fillColor: '#CC3363'
            };
            constants.setConstant("palette", paletteInterface);
        });
    }
    setSetupComplete(settings, setup, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DatabaseConnection_1.default.instance.addSettings(settings.serverName, settings.version, settings.expRate, settings.dropRate, settings.mesoRate, settings.nxColumn, settings.vpColumn, settings.gmLevel);
            yield DatabaseConnection_1.default.instance.addDownload('Setup', setup);
            yield DatabaseConnection_1.default.instance.addDownload('Client', client);
        });
    }
    saveInstallerObject(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile("settings/setup.MN", JSON.stringify(data), (err) => {
                if (err)
                    reject(err);
                resolve(data);
            });
        });
    }
    getInstallerObject(src) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.installationComplete(src);
        });
    }
    getInstallErrors(error) {
        switch (error) {
            case "ECONNREFUSED":
                return "connection refused.. is mysql on?";
            case "ENOTFOUND":
                return "Could not connect to host";
            case "ER_ACCESS_DENIED_ERROR":
                return "Wrong username or password";
            case "ER_BAD_DB_ERROR":
                return "Could not find database";
            default:
                return "something went wrong... error code: " + error;
        }
    }
}
exports.default = InstallationHandler;
//# sourceMappingURL=InstallationHandler.js.map