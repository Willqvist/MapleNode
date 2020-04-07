const fs = require("fs");
const async = require("async");
const mysql = require("./mysql").getMysql();
const constants = require("./Constants");
const DBConn = require("../database/DatabaseConnection");
class InstallationHandler
{
    async installationComplete()
    {
        return new Promise((resolve,reject) => {
            fs.exists("settings/setup.MN", (exists) => {
                let data =
                    {
                        done: false,
                        mysqlSetupComplete: false,
                    };
                if (exists) {
                    fs.readFile("settings/setup.MN", "utf8", (err, text) => {
                        let data = JSON.parse(text);
                        resolve(data);
                    });
                } else {
                    reject(data);
                }
            });
        });
    }
    async setMysqlSetupComplete(userData)
    {
        let data = await this.getInstallerObject();
        data.mysqlSetupComplete = true;
        data.prefix = userData.prefix;
        constants.setConstant("prefix",userData.prefix);
        console.log("stop that fear!");
        await DBConn.instance.rebuildDatabase(data.prefix);
        await DBConn.instance.addPalette('Happy Green','#69DC9E','#3E78B2','#D3F3EE','#20063B','#CC3363','1');
        await DBConn.instance.addDesign('headerImage.png','svgs/logo.svg');
        await DBConn.instance.updateLayout('home','{"0":{"name":"info_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":1,"size":6}},"1":{"name":"control_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":1,"size":4}},"2":{"name":"news_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":6,"size":8}},"3":{"name":"server_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":4,"size":8}},"4":{"name":"stats_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":8,"size":10}},"5":{"name":"ranking_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":10,"size":14}}}');

        constants.setConstant("palette",
            {
                name:'Happy Green',
                mainColor:'#69DC9E',
                secondaryMainColor:'#3E78B2',
                fontColorLight:'#D3F3EE',
                ontColorDark:'#20063B',
                fillColor:'#CC3363'
            });
    }
    async setSetupComplete(userData)
    {

        await DBConn.instance.addSettings(userData.serverName,
            userData.version,
            userData.exp,
            userData.drop,
            userData.meso,
            userData.nx,
            userData.vp,
            userData.gmLevel
        );

        await DBConn.instance.addDownload('Setup',userData.downloadSetup);
        await  DBConn.instance.addDownload('Client',userData.downloadClient);
        data.save = true;
    }
    saveInstallerObject(data)
    {
        return new Promise((resolve,reject) => {
            fs.writeFile("settings/setup.MN", JSON.stringify(data), (err) => {
                if(err) reject(err);
                resolve(data);
            });
        });
    }
    async getInstallerObject()
    {
      return await this.installationComplete();
    }
    getInstallErrors(error)
    {
        switch(error)
        {
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
module.exports = InstallationHandler;