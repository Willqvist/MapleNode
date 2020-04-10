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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseConnection_1 = __importDefault(require("./src/database/DatabaseConnection"));
const InstallationHandler_1 = __importDefault(require("./src/tools/InstallationHandler"));
const consts = __importStar(require("./src/tools/Constants"));
const Logger_1 = __importDefault(require("./src/logger/Logger"));
function setup(server, setupListeners, setupComplete) {
    return __awaiter(this, void 0, void 0, function* () {
        let installer = new InstallationHandler_1.default();
        setupListeners();
        let data;
        try {
            data = yield installer.getInstallerObject();
        }
        catch (err) {
            Logger_1.default.log("To begin setup, visit /setup");
            return;
        }
        console.log("setup!");
        if (!data.prefix) {
            Logger_1.default.warn("prefix value is not set... have you finished setup? go to: localhost:" + server.address().port + "/setup/");
        }
        else {
            consts.setConstant("prefix", data.prefix);
            consts.setConstant("realPath", __dirname);
        }
        if (data.done && data.prefix) {
            let [settings, err] = yield DatabaseConnection_1.default.instance.getSettings();
            let [design, errDesign] = yield DatabaseConnection_1.default.instance.getDesign({ select: ["heroImage", "logo"] });
            let [palette, errPalette] = yield DatabaseConnection_1.default.instance.getActivePalette();
            setConstants(settings, design, palette);
            setupComplete();
        }
        else {
            consts.setConstant("setup-status", -1);
            Logger_1.default.warn("setup incomplete: visit localhost/setup");
        }
    });
}
exports.default = setup;
function setConstants(settings, design, palette) {
    consts.setConstant("settings", settings);
    consts.setConstant("heroImage", design.heroImage);
    consts.setConstant("logo", design.logo);
    consts.setConstant("palette", palette);
}
//# sourceMappingURL=setup.js.map