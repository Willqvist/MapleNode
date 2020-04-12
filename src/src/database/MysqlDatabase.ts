import {Database,SWO,Error} from "./Database";
import mysql from "mysql2/promise";
import errno from "../tools/Errno"
import {
    accountsConversion,
    charactersConversion,
    mn_designConversion,
    mn_downloadsConversion, mn_layoutConversion, mn_palettesConversion,
    mn_settingsConversion, mn_voteConversion
} from "./MysqlConversions";
import {
    AccountsInterface,
    CharactersInterface,
    DesignInterface,
    DownloadsInterface, LayoutInterface,
    PalettesInterface,
    SettingsInterface, VoteInterface
} from "./DatabaseInterfaces";
import { EquipmentInterface } from "../tools/Interfaces";
import Errno from "../tools/Errno";

const Constants = require("../tools/Constants");
const Logger = require("../logger/Logger");
const fs = require("fs").promises;

export class MysqlDatabase implements Database {

    connection : any;

    async onInstansiate(data) : Promise<boolean> {
        data.multipleStatements = true;
        try {
            this.connection = await mysql.createConnection(data);
        } catch(err) {
            let errno : Errno = {errno:err.errno,msg: err.message};
            throw errno;
            return false;
        }
        return true;
    }

    table(name) {
        return `${Constants.getConstant("prefix")}_${name}`;
    }

    private async generateSelectSql(obj : SWO, table : string) : Promise<any> {

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
                let pre = "WHERE"
                for (let key in obj.where) {
                    if(key === "iterate") continue;
                    where += `${pre} ${key}='${obj.where[key]}' `;
                    pre = "AND";
                }
            }
            if(obj.order) {
                let key = Object.keys(obj.order)[0];
                order = `ORDER BY ${key} ${obj.order[key]}`;
            }
        }
       return await this.connection.query(`SELECT ${select} FROM ${this.table(table)} ${where}${order}`);
    }

    private convert(rows : any[],conversions:any) : any[] {
        let row = new Array(rows.length);
        for(let i = 0; i < rows.length; i++) {
            row[i] = {};
            let keys = Object.keys(rows[i]);
            for(let key in keys) {
                row[i][keys[key]] = conversions[keys[key]](rows[i][keys[key]]);
            }
        }
        return row;
    }

    private async exec(obj : SWO, name : string,conversions? : any) : Promise<[any[],string]> {
        let err;
        let row : any[];
        try {
            let [rows,fields] = await this.generateSelectSql(obj, name);
            row = rows;
            if(conversions) {
               row = this.convert(rows,conversions);
            }
        } catch(error) {
            err = error.message;
        }
        return [row,err];
    }

    async getCharacter(name : string, obj?: SWO): Promise<CharactersInterface> {
        if(!obj) {
            obj = {
                where:{},
                select:[]
            }
        }
        obj.where["name"] = name;
        obj.select.push("id");
        let [rows, err] = await this.exec(obj, "characters",charactersConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }

    async getSettings(obj : SWO) :Promise<SettingsInterface> {
        let [rows, err] = await this.exec(obj, "settings",mn_settingsConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getDesign(obj : SWO) :Promise<DesignInterface> {
        let [rows, err] = await this.exec(obj, "design",mn_designConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getActivePalette(obj) :Promise<PalettesInterface> {
        if(!obj){
            obj = {
                where:[]
            };
        }
        obj.where["active"] = 1;
        let [rows, err] = await this.exec(obj, "palettes",mn_palettesConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getDownloads(obj : SWO) :Promise<DownloadsInterface> {
        let [rows, err] = await this.exec(obj, "downloads",mn_downloadsConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getVotes(obj : SWO) :Promise<VoteInterface[]> {
        let [rows, err] = await this.exec(obj, "votes",mn_voteConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows;
    }
    async getVote(id : number, obj : SWO) :Promise<VoteInterface> {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["id"] = id;
        let [rows, err] = await this.exec(obj, "votes",mn_voteConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getPalette(id : string, obj : SWO) :Promise<PalettesInterface> {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["id"] = id;
        let [rows, err] = await this.exec(obj, "palettes",mn_palettesConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async getLayout(name : string,obj : SWO) :Promise<LayoutInterface> {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["name"] = name;
        let [rows, err] = await this.exec(obj, "layout",mn_layoutConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }

    async getAccount(name : string,obj : SWO): Promise<AccountsInterface> {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["name"] = name;
        let [rows, err] = await this.exec(obj, "accounts",accountsConversion);
        if(err) {
            throw {errno:0,msg:err};
        }
        return rows[0];
    }
    async addPalette(name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("palettes")} (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES
        ('${name}','${mainColor}','${secondaryMainColor}','${fontColorDark}','${fontColorLight}','${fillColor}','${active}')`);
        return rows;
    }
    async addDownload(name,url) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("downloads")} (name,url) VALUES
        ('${name}','${url}')`);
        return rows;
    }

    async updateLayout(name: string,json: string) : Promise<boolean> {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("layout")} (name,json) VALUES
        ('${name}','${json}')`);
        return rows;
    }
    async addDesign(heroImage,logo) : Promise<boolean> {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("design")} (heroImage,logo) VALUES
        ('${heroImage}','${logo}')`);
        return rows;
    }

    async addSettings(serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel) : Promise<boolean> {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("settings")} (serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel)
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
    }

    async rebuildDatabase(prefix) : Promise<boolean> {
        let file = await fs.readFile("./settings/setup.sql","utf8");
        file = file.replace(/prefix/g,prefix).split(";");
        for(let i = 0; i < file.length; i++) {
            if(file[i].length == 0) continue;
            let [rows, tables] = await this.connection.query(file[i]);
        }
        return true;
    }

    addAccount(name: string, password: string, birthday: string, email: string): Promise<boolean> {
        return undefined;
    }

    addVote(name: string, url: string, nx: number, time: number): Promise<boolean> {
        return undefined;
    }

    addVoting(accountid: number, voteid: number): Promise<boolean> {
        return undefined;
    }

    deleteDownload(id): Promise<boolean> {
        return undefined;
    }

    deletePalette(id: number): Promise<boolean> {
        return undefined;
    }

    deleteVote(id: number): Promise<boolean> {
        return undefined;
    }

    enablePalette(id: number): Promise<boolean> {
        return undefined;
    }

    loadRank(searchFlag, page: number, order: number): Promise<boolean> {
        return undefined;
    }

    updateDownload(id, name: string, url: string): Promise<boolean> {
        return undefined;
    }

    updateHeroImage(heroImage: string): Promise<boolean> {
        return undefined;
    }

    updateLogo(logo: string): Promise<boolean> {
        return undefined;
    }

    updatePalette(id: number, mainColor: string, secondaryMainColor: string, fontColorDark: string, fontColorLight: string, fillColor: string): Promise<boolean> {
        return undefined;
    }

    getEquipment(character: number): Promise<EquipmentInterface[]> {
        return undefined;
    }
}