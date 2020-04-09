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
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2/promise");
const MysqlConversions_1 = require("./MysqlConversions");
const Constants = require("../tools/Constants");
const Logger = require("../logger/Logger");
const fs = require("fs").promises;
class MysqlDatabase {
    onInstansiate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.multipleStatements = true;
            this.connection = yield mysql.createConnection(data);
            return true;
        });
    }
    table(name) {
        return `${Constants.getConstant("prefix")}_${name}`;
    }
    generateSelectSql(obj, table) {
        return __awaiter(this, void 0, void 0, function* () {
            let select = "*";
            let where = "";
            let order = "";
            if (obj) {
                if (obj.select) {
                    select = "";
                    for (let i = 0; i < obj.select.length; i++)
                        select += `${obj.select[i]},`;
                    select = select.substring(0, select.length - 1);
                }
                if (obj.where) {
                    where = "";
                    let pre = "WHERE";
                    for (let key in obj.where) {
                        if (key === "iterate")
                            continue;
                        where += `${pre} ${key}='${obj.where[key]}' `;
                        pre = "AND";
                    }
                }
                if (obj.order) {
                    let key = Object.keys(obj.order)[0];
                    order = `ORDER BY ${key} ${obj.order[key]}`;
                }
            }
            return yield this.connection.query(`SELECT ${select} FROM ${this.table(table)} ${where}${order}`);
        });
    }
    convert(rows, conversions) {
        let row = new Array(rows.length);
        for (let i = 0; i < rows.length; i++) {
            row[i] = {};
            let keys = Object.keys(rows[i]);
            for (let key in keys) {
                row[i][key] = conversions[key](rows[i][key]);
            }
        }
        return row;
    }
    exec(obj, name, conversions) {
        return __awaiter(this, void 0, void 0, function* () {
            let err;
            let row;
            try {
                let [rows, fields] = yield this.generateSelectSql(obj, name);
                row = rows;
                if (conversions) {
                    row = this.convert(rows, conversions);
                }
            }
            catch (error) {
                err = error.message;
            }
            return [row, err];
        });
    }
    getCharacter(name, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: {},
                    select: []
                };
            }
            obj.where["name"] = name;
            obj.select.push("id");
            let [rows, err] = yield this.exec(obj, "characters", MysqlConversions_1.charactersConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                id: data.id,
                skincolor: data.skincolor,
                hair: data.hair,
                face: data.face,
                job: data.job,
                gender: data.gender
            };
            return [ret, null];
        });
    }
    getSettings(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, err] = yield this.exec(obj, "settings", MysqlConversions_1.mn_settingsConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                version: data.version,
                serverName: data.serverName,
                exp: data.exp,
                drop: data.drop,
                meso: data.meso,
                nx: data.nx,
                vp: data.vp,
                gmLevel: data.gmLevel
            };
            return [ret, null];
        });
    }
    getDesign(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, err] = yield this.exec(obj, "design", MysqlConversions_1.mn_designConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                heroImage: data.heroImage,
                logo: data.logo
            };
            return [ret, null];
        });
    }
    getActivePalette(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: []
                };
            }
            obj.where["active"] = 1;
            let [rows, err] = yield this.exec(obj, "design", MysqlConversions_1.mn_designConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                name: data.name,
                mainColor: data.mainColor,
                secondaryMainColor: data.secondaryMainColor,
                fontColorLight: data.fontColorLight,
                fontColorDark: data.fontColorDark,
                fillColor: data.fillColor
            };
            return [ret, null];
        });
    }
    getDownloads(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, err] = yield this.exec(obj, "downloads", MysqlConversions_1.mn_downloadsConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                downloadClient: data.downloadClient,
                downloadSetup: data.downloadSetup
            };
            return [ret, null];
        });
    }
    getVotes(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, err] = yield this.exec(obj, "votes", MysqlConversions_1.mn_voteConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                name: data.downloadClient,
                amount: data.downloadSetup,
                url: ""
            };
            let arr = [];
            arr.push(ret);
            return [arr, null];
        });
    }
    getVote(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: []
                };
            }
            obj.where["id"] = id;
            let [rows, err] = yield this.exec(obj, "votes", MysqlConversions_1.mn_voteConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                name: data.downloadClient,
                amount: data.downloadSetup,
                url: ""
            };
            return [ret, null];
        });
    }
    getPalette(id, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: []
                };
            }
            obj.where["id"] = id;
            let [rows, err] = yield this.exec(obj, "palettes", MysqlConversions_1.mn_palettesConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                name: data.name,
                mainColor: data.mainColor,
                secondaryMainColor: data.secondaryMainColor,
                fontColorLight: data.fontColorLight,
                fontColorDark: data.fontColorDark,
                fillColor: data.fillColor,
            };
            return [ret, null];
        });
    }
    getLayout(name, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: []
                };
            }
            obj.where["name"] = name;
            let [rows, err] = yield this.exec(obj, "layout", MysqlConversions_1.mn_layoutConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                name: data.name,
                json: data.json
            };
            return [ret, null];
        });
    }
    getAccount(name, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj) {
                obj = {
                    where: []
                };
            }
            obj.where["name"] = name;
            let [rows, err] = yield this.exec(obj, "accounts", MysqlConversions_1.accountsConversion);
            if (err) {
                return [null, { errorCode: 0, errorMsg: err }];
            }
            let data = rows[0];
            let ret = {
                heroImage: data.name,
                logo: data.json
            };
            return [ret, null];
        });
    }
    addPalette(name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor, active) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, l] = yield this.connection.query(`INSERT INTO ${this.table("palettes")} (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES
        ('${name}','${mainColor}','${secondaryMainColor}','${fontColorDark}','${fontColorLight}','${fillColor}','${active}')`);
            return rows;
        });
    }
    addDownload(name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, l] = yield this.connection.query(`INSERT INTO ${this.table("downloads")} (name,url) VALUES
        ('${name}','${url}')`);
            return rows;
        });
    }
    updateLayout(name, json) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, l] = yield this.connection.query(`INSERT INTO ${this.table("layout")} (name,json) VALUES
        ('${name}','${json}')`);
            return rows;
        });
    }
    addDesign(heroImage, logo) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, l] = yield this.connection.query(`INSERT INTO ${this.table("design")} (heroImage,logo) VALUES
        ('${heroImage}','${logo}')`);
            return rows;
        });
    }
    addSettings(serverName, version, expRate, dropRate, mesoRate, nxColumn, vpColumn, gmLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            let [rows, l] = yield this.connection.query(`INSERT INTO ${this.table("settings")} (serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel)
                VALUES(
                    '${serverName}',
                    '${version}',
                    '${expRate}',
                    '${dropRate}',
                    '${mesoRate}',
                    '${nxColumn}',
                    '${vpColumn}',
                    '${gmLevel}'
                )`);
            return rows;
        });
    }
    rebuildDatabase(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield fs.readFile("./settings/setup.sql", "utf8");
            file = file.replace(/prefix/g, prefix).split(";");
            for (let i = 0; i < file.length; i++) {
                if (file[i].length == 0)
                    continue;
                let [rows, tables] = yield this.connection.query(file[i]);
            }
            return true;
        });
    }
    addAccount(name, password, birthday, email) {
        return undefined;
    }
    addVote(name, url, nx, time) {
        return undefined;
    }
    addVoting(accountid, voteid) {
        return undefined;
    }
    deleteDownload(id) {
        return undefined;
    }
    deletePalette(id) {
        return undefined;
    }
    deleteVote(id) {
        return undefined;
    }
    enablePalette(id) {
        return undefined;
    }
    loadRank(searchFlag, page, order) {
        return undefined;
    }
    updateDownload(id, name, url) {
        return undefined;
    }
    updateHeroImage(heroImage) {
        return undefined;
    }
    updateLogo(logo) {
        return undefined;
    }
    updatePalette(id, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor) {
        return undefined;
    }
    getEquipment(character) {
        return undefined;
    }
}
exports.MysqlDatabase = MysqlDatabase;
//# sourceMappingURL=MysqlDatabase.js.map