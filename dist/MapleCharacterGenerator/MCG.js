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
const ItemBuilderXml_1 = __importDefault(require("./ItemBuilderXml"));
const ItemBuilderJson_1 = __importDefault(require("./ItemBuilderJson"));
const util_1 = __importDefault(require("util"));
const fs_1 = __importDefault(require("fs"));
const Constants = __importStar(require("../src/tools/Constants"));
const DatabaseConnection_1 = __importDefault(require("../src/database/DatabaseConnection"));
var ERROR;
(function (ERROR) {
    ERROR[ERROR["INVALID_PLAYER"] = 0] = "INVALID_PLAYER";
    ERROR[ERROR["CANT_FIND_ITEM"] = 1] = "CANT_FIND_ITEM";
})(ERROR || (ERROR = {}));
class MapleCharacterGenerator {
    constructor(cooldown) {
        this.cooldown = cooldown * 0;
        this.parts = {};
        this.que = [];
        this.generators = {
            "Xml": new ItemBuilderXml_1.default(),
            "Json": new ItemBuilderJson_1.default()
        };
    }
    addToQueue(player) {
        this.que.push(player);
        if (this.que.length == 1)
            this.buildPlayer(player);
    }
    goToNextInQueue() {
        this.removeFromQueue(0);
        if (this.que.length == 0)
            return;
        this.buildPlayer(this.que[0]);
    }
    removeFromQueue(index) {
        this.que.splice(index, 1);
    }
    generatePlayer(name, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.builder)
                this.builder = this.generators[Constants.getConstant("MCG")];
            let player = { parts: {}, name: name, callback: callback };
            if (fs_1.default.existsSync(__dirname + "/Characters/" + name + ".png")) {
                let stat = fs_1.default.statSync(__dirname + "/Characters/" + name + ".png");
                let date = new Date(util_1.default.inspect(stat.mtime));
                let dateNow = new Date();
                if ((dateNow.getMinutes() - date.getMinutes()) / 1000 < this.cooldown)
                    return callback({ success: true });
            }
            let [result, err] = yield DatabaseConnection_1.default.instance.getCharacter(name, { select: ["face", "hair", "skincolor"] });
            if (err)
                throw err;
            if (!result)
                return callback({ success: false, errorID: ERROR.INVALID_PLAYER, reason: "cant find player: " + name });
            player.parts.face = result.face;
            player.parts.hair = result.hair;
            player.parts.skincolor = result.skincolor;
            DatabaseConnection_1.default.instance.getEquipment(result.id);
            mysql.query("SELECT inventoryitems.itemid, inventoryitems.position FROM inventoryequipment INNER JOIN inventoryitems ON inventoryequipment.inventoryitemid = inventoryitems.inventoryitemid WHERE inventoryitems.characterid = ? AND inventoryitems.inventorytype = '-1'", [results[0].id], ((err, results) => {
                if (err)
                    throw err;
                player.items = results;
                this.addToQueue(player);
            }).bind(player));
        });
    }
    buildPlayer(player) {
        this.builder.parts = player.parts;
        let results = player.items;
        for (let i = 0; i < results.length; i++) {
            switch (results[i].position) {
                case -1:
                case -101:
                    player.parts.cap = results[i].itemid;
                    break;
                case -2:
                case -102:
                    player.parts.mask = results[i].itemid;
                    break;
                case -3:
                case -103:
                    player.parts.eyes = results[i].itemid;
                    break;
                case -4:
                case -104:
                    player.parts.ears = results[i].itemid;
                    break;
                case -5:
                case -105:
                    player.parts.coat = results[i].itemid;
                    break;
                case -6:
                case -106:
                    player.parts.pants = results[i].itemid;
                    break;
                case -7:
                case -107:
                    player.parts.shoes = results[i].itemid;
                    break;
                case -8:
                case -108:
                    player.parts.glove = results[i].itemid;
                    break;
                case -9:
                case -109:
                    player.parts.cape = results[i].itemid;
                    break;
                case -10:
                case -110:
                    player.parts.shield = results[i].itemid;
                    break;
                case -11:
                case -111:
                    {
                        player.parts.weapon = results[i].itemid;
                        if (player.parts.weapon < 1700000)
                            this.builder.setWeaponInfo(player.parts.weapon);
                        else
                            player.parts.stand = 1;
                    }
                    break;
            }
        }
        if (player.parts.coat == null)
            player.parts.coat = 1040006;
        //1062051
        //1060002
        this.builder.equipItems(player, [
            { method: this.builder.setCape, parameters: { id: player.parts.cape, z: "capeBelowBody" } },
            { method: this.builder.setShield, parameters: { id: player.parts.shield, z: "shield" } },
            { method: this.builder.setCap, parameters: { id: player.parts.cap, z: "capAccessoryBelowBody" } },
            { method: this.builder.setTorso, parameters: { id: player.parts.skincolor + 2000, z: "skincolor" } },
            { method: this.builder.setCoat, parameters: { id: player.parts.coat, z: "mailChestBelowPants" } },
            { method: this.builder.setLongCoat, parameters: { id: player.parts.coat, z: "mailChestBelowPants" } },
            { method: this.builder.setPants, parameters: { id: player.parts.pants, z: "pantsBelowShoes" } },
            { method: this.builder.setShoes, parameters: { id: player.parts.shoes, z: "shoes" } },
            { method: this.builder.setPants, parameters: { id: player.parts.pants, z: "pants" } },
            { method: this.builder.setShoes, parameters: { id: player.parts.shoes, z: "shoesOverPants" } },
            { method: this.builder.setLongCoat, parameters: { id: player.parts.coat, z: "mailChestOverPants" } },
            { method: this.builder.setCoat, parameters: { id: player.parts.coat, z: "mailChest" } },
            { method: this.builder.setLongCoat, parameters: { id: player.parts.coat, z: "mailChest" } },
            { method: this.builder.setLongCoat, parameters: { id: player.parts.coat, z: "mailChestOverHighest" } },
            { method: this.builder.setHead, parameters: { id: player.parts.skincolor + 2000, z: "skincolor" } },
            { method: this.builder.setAccessory, parameters: { id: player.parts.ears, z: "accessoryEar" } },
            { method: this.builder.setAccessory, parameters: { id: player.parts.mask, z: "accessoryFaceBelowFace" } },
            { method: this.builder.setFace, parameters: { id: player.parts.face, z: "face" } },
            { method: this.builder.setAccessory, parameters: { id: player.parts.mask, z: "accessoryFace" } },
            { method: this.builder.setAccessory, parameters: { id: player.parts.eyes, z: "accessoryEye" } },
            { method: this.builder.setHair, parameters: { id: player.parts.hair, z: "hairShade" } },
            { method: this.builder.setHair, parameters: { id: player.parts.hair, z: "hair" } },
            { method: this.builder.setHair, parameters: { id: player.parts.hair, z: "hairOverHead" } },
            { method: this.builder.setCap, parameters: { id: player.parts.cap, z: "cap" } },
            { method: this.builder.setGloves, parameters: { id: player.parts.glove, z: "gloveOverBody" } },
            { method: this.builder.setWeapon, parameters: { id: player.parts.weapon, z: "weapon" } },
            { method: this.builder.setArm, parameters: { id: player.parts.skincolor + 2000 } },
            { method: this.builder.setCoat, parameters: { id: player.parts.coat, z: "mailArm" } },
            { method: this.builder.setLongCoat, parameters: { id: player.parts.coat, z: "mailArm" } },
            { method: this.builder.setWeapon, parameters: { id: player.parts.weapon, z: "weaponOverArm" } },
            { method: this.builder.setHands, parameters: { id: player.parts.skincolor + 2000 } },
            { method: this.builder.setGloves, parameters: { id: player.parts.glove, z: "glove" } },
            { method: this.builder.setGloves, parameters: { id: player.parts.glove, z: "gloveOverHair" } },
        ], (player) => {
            this.builder.outputImage(this.builder.canvas, __dirname + "/Characters/" + player.name + ".png", () => {
                player.callback({ success: true });
                this.goToNextInQueue();
            });
        });
    }
}
exports.default = MapleCharacterGenerator;
//# sourceMappingURL=MCG.js.map