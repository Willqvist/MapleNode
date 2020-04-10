import * as fs from "fs";
import * as constants from "./Constants";
import DBConn from "../database/DatabaseConnection";
import { PalettesInterface, SettingsInterface, DownloadsInterface } from "../database/DatabaseInterfaces";
import {HOME} from "../../Paths";

export interface InstallerI {
    mysqlSetupComplete : boolean;
    prefix?: string;
    done : boolean;
};

export default class InstallationHandler
{
    async installationComplete(src : string) : Promise<InstallerI>
    {
        return new Promise((resolve:(InstallerI)=>void,reject) => {
            fs.access(HOME+src,fs.constants.F_OK, (err) => {
                let data : InstallerI =
                {
                    done: false,
                    mysqlSetupComplete: false,
                };
                if (!err) {
                    fs.readFile(HOME+src, "utf8", (err, text) => {
                        data = JSON.parse(text);
                        let ret : InstallerI = {
                            mysqlSetupComplete: data.mysqlSetupComplete,
                            prefix: data.prefix,
                            done:data.done
                        };
                        resolve(ret);
                    });
                } else {
                    fs.writeFile(HOME+src,JSON.stringify(data),{flag:'wx'},(err)=> {
                        if(err) reject(err);
                        resolve(data);
                    })
                }
            });
        });
    }
    async setMysqlSetupComplete(userData)
    {
        let data : any = {};
        data.mysqlSetupComplete = true;
        data.prefix = userData.prefix;
        constants.setConstant("prefix",userData.prefix);
        console.log("stop that fear!");
        await DBConn.instance.rebuildDatabase(data.prefix);
        await DBConn.instance.addPalette('Happy Green','#69DC9E','#3E78B2','#D3F3EE','#20063B','#CC3363',1);
        await DBConn.instance.addDesign('headerImage.png','svgs/logo.svg');
        await DBConn.instance.updateLayout('home','{"0":{"name":"info_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":1,"size":6}},"1":{"name":"control_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":1,"size":4}},"2":{"name":"news_box","panel":"none","columns":{"pos":1,"size":7},"rows":{"pos":6,"size":8}},"3":{"name":"server_box","panel":"none","columns":{"pos":7,"size":10},"rows":{"pos":4,"size":8}},"4":{"name":"stats_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":8,"size":10}},"5":{"name":"ranking_box","panel":"none","columns":{"pos":1,"size":10},"rows":{"pos":10,"size":14}}}');

        let paletteInterface : PalettesInterface = {
            name:'Happy Green',
            mainColor:'#69DC9E',
            secondaryMainColor:'#3E78B2',
            fontColorLight:'#D3F3EE',
            fontColorDark:'#20063B',
            fillColor:'#CC3363'
        };

        constants.setConstant("palette",paletteInterface);
    }
    async setSetupComplete(settings : SettingsInterface, setup : string, client : string)
    {

        await DBConn.instance.addSettings(settings.serverName,
            settings.version,
            settings.expRate,
            settings.dropRate,
            settings.mesoRate,
            settings.nxColumn,
            settings.vpColumn,
            settings.gmLevel
        );

        await DBConn.instance.addDownload('Setup',setup);
        await  DBConn.instance.addDownload('Client',client);
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
    async getInstallerObject(src: string)
    {
      return await this.installationComplete(src);
    }
    getInstallErrors(error : string) : string
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