import * as fs from "fs";
import * as constants from "../core/Constants";
import DBConn from "../core/database/DatabaseConnection";
import { PalettesInterface, SettingsInterface, DownloadsInterface } from "../core/Interfaces/DatabaseInterfaces";
import {HOME} from "../Paths";
import Errno from "../core/tools/Errno";
import {openConfig} from "../core/config/Config";
export interface InstallerI {
    mysqlSetupComplete : boolean;
    settingsComplete : boolean;
    done : boolean;
};

export default class InstallationHandler
{
    installObj : InstallerI = null;
    async installationComplete(src : string) : Promise<InstallerI>
    {
        return new Promise((resolve:(InstallerI)=>void,reject) => {

            if(this.installObj) {
                return resolve(this.installObj);
            }

            fs.access(HOME+src,fs.constants.F_OK, (err) => {
                let data : InstallerI = {
                    mysqlSetupComplete:false,
                    done:false,
                    settingsComplete:false
                };
                this.installObj = data;
                if (!err) {
                    fs.readFile(HOME+src, "utf8", (err, text) => {
                        if(err) reject(err);
                        try {
                            let data = JSON.parse(text);
                            let ret: InstallerI = {
                                mysqlSetupComplete: data.mysqlSetupComplete,
                                done: data.done,
                                settingsComplete: data.settingsComplete
                            };
                            constants.setConstant("prefix", data.prefix);
                            this.installObj = ret;
                            resolve(ret);
                        }catch(err) {
                            fs.writeFile(HOME+src,JSON.stringify(data),{flag:'w'},(err)=> {
                                if(err) reject(err);
                                this.installObj = data;
                                resolve(data);
                            })
                        }
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
        constants.setConstant("prefix",userData.prefix);
        await this.saveInstallerObject({done:false,settingsComplete:false,mysqlSetupComplete:true});
        await DBConn.instance.rebuildDatabase(userData.prefix);
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

    private async writeToFile(src: string, data: string) : Promise<boolean> {
        return new Promise<boolean>(resolve => {
            fs.writeFile(HOME+src,data,{flag:'wx'},(err)=> {
                resolve(!err);
            })
        });
    }

    async saveSettings(settings : SettingsInterface, setup : string, client : string,src:string = "/settings/setup.MN")
    {
        try {
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

        let data : InstallerI = await this.getInstallerObject(src);
        data.settingsComplete = true;
        await this.saveInstallerObject(data);

        } catch(err) {
            console.log(err);
        }
    }

    async setupComplete(src:string = "/settings/setup.MN") {
        let data : InstallerI = await this.getInstallerObject(HOME+src);
        data.done = true;
        await this.saveInstallerObject(data);
    }

    saveInstallerObject(data : InstallerI,src:string = "/settings/setup.MN")
    {
        this.installObj = data;
        return new Promise((resolve,reject) => {
            console.log("path: ",HOME+src);
            fs.writeFile(HOME+src, JSON.stringify(data), (err) => {
                if(err) reject(err);
                resolve(data);
            });
        });
    }
    async getInstallerObject(src: string) : Promise<InstallerI>
    {
      return await this.installationComplete(src);
    }
    getInstallErrors(error : Errno) : string
    {
        console.log(error.errno);
        switch(error.errno)
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
                return error.msg;
        }
    }
}
