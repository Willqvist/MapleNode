const Database = require("./Database");
const mysql = require("mysql2/promise");
const Constants = require("../tools/Constants");
const Logger = require("../logger/Logger");
const fs = require("fs").promises;
class MysqlDatabase extends Database {

    async onInstansiate(data) {
        data.multipleStatements = true;
        this.connection = await mysql.createConnection(data);
        return true;
    }

    table(name) {
        return `${Constants.getConstant("prefix")}_${name}`;
    }

    async generateSelectSql(obj, table) {

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

    async exec(obj,name) {
        let err;
        let row;
        try {
            let [rows,fields] = await this.generateSelectSql(obj, name);
            row = rows;
        } catch(error) {
            err = error.message;
        }
        return [row,err];
    }

    async getSettings(obj) {
        return await this.exec(obj,"settings");
    }
    async getDesign(obj) {
        return await this.exec(obj,"design");
    }
    async getActivePalette(obj) {
        if(!obj){
            obj = {
                where:[]
            };
        }
        obj.where["active"] = 1;
        return await this.exec(obj,"palettes");
    }
    async getDownloads(obj) {
        return await this.exec(obj,"downloads");
    }
    async getVotes(obj) {
        return await this.exec(obj,"votes");
    }
    async getVote(id, obj) {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["id"] = id;
        return await this.exec(obj,"votes");
    }
    async getPalette(id, obj) {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["id"] = id;
        return await this.exec(obj,"palettes");
    }
    async getLayout(name,obj) {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["name"] = name;
        return await this.exec(obj,"layout");
    }
    async loadRank(searchFlag,page,order,obj) {
    }
    async getUser(name,password,obj) {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["name"] = name;
        obj.where["password"] = password;
        return await this.exec(obj,"users");
    }
    async addAccount(name,password,birthday,email) {

    }
    async getAccount(name,obj) {
        if(!obj) {
            obj = {
                where:[]
            }
        }
        obj.where["name"] = name;
        return await this.exec(obj,"accounts");
    }
    async addVoting(accountid, voteid) {

    }
    async addVote(name,url,nx,time) {

    }
    async deleteVote(id) {

    }
    async addPalette(name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("palettes")} (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES
        ('${name}','${mainColor}','${secondaryMainColor}','${fontColorDark}','${fontColorLight}','${fillColor}','${active}')`);
        return rows;
    }
    async enablePalette(id) {

    }
    async deletePalette(id) {

    }
    async updatePalette(id,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor) {

    }
    async updateHeroImage(heroImage) {

    }
    async updateLogo(logo) {

    }
    async updateDownload(id,name,url) {

    }
    async deleteDownload(id) {

    }
    async addDownload(name,url) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("downloads")} (name,url) VALUES
        ('${name}','${url}')`);
        return rows;
    }
    async getlayout(name) {
        let obj = {
            where:{name:name}
        };
        return await this.exec(obj,"layout");
    }

    async updateLayout(name,json) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("layout")} (name,json) VALUES
        ('${name}','${json}')`);
        return rows;
    }
    async addDesign(heroImage,logo) {
        let [rows,l] = await this.connection.query(`INSERT INTO ${this.table("design")} (heroImage,logo) VALUES
        ('${heroImage}','${logo}')`);
        return rows;
    }

    async addSettings(serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel) {
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

    async rebuildDatabase(prefix) {
        let file = await fs.readFile("./settings/setup.sql","utf8");
        file = file.replace(/prefix/g,prefix).split(";");
        for(let i = 0; i < file.length; i++) {
            if(file[i].length == 0) continue;
            let [rows, tables] = await this.connection.query(file[i]);
        }

    }
}

module.exports = MysqlDatabase;