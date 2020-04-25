import InstallationHandler, {InstallerI} from "../setup/InstallationHandler";
import FileTools from "../core/tools/FileTools";
import mime from 'mime-types';
import DBConn from "../core/database/DatabaseConnection";
import app from "../app";
import mnHandler from "../setup/MNHandler";
import {SettingsInterface} from "../core/Interfaces/DatabaseInterfaces";
import * as constants from "../core/Constants";
import {openConfig} from "../core/config/Config";
import {DatabaseAuthInterface} from "../core/Interfaces/Interfaces";

export default class Setup {

    private installHandler : InstallationHandler;
    private readonly settingsSrc : string = "/settings/setup.MN";
    constructor() {
        this.installHandler= new InstallationHandler();
    }

    public async setDesign(logo? : SetupFile, hero? : SetupFile) {
        if(logo)
            await this.move(logo);
        if(hero)
            await this.move(hero);
    }

    public async addPalette(name,mainColor,secondaryMainColor,fillColor,fontColorDark,fontColorLight) {
        let result = await DBConn.instance.addPalette(
            name,
            mainColor,
            secondaryMainColor,
            fillColor,
            fontColorDark,
            fontColorLight,
            1
        );
    }


    /*
                        data.user = req.body.user;
                    data.password = req.body.password;
                    data.host = req.body.host;
                    data.database = req.body.database;
                    data.prefix = prefix;
     */
    public async connectToDatabase(data: any) {
        let auth : DatabaseAuthInterface = {
            user:data.user,
            password:data.password,
            host:data.host,
            database:data.database
        };
        await DBConn.createInstance(app.getDatabase(), auth);
        let writer = await openConfig();
        await writer.write("server/database/prefix",data.prefix);
        await writer.write("server/database/auth",auth);
        await this.installHandler.setMysqlSetupComplete(data);
    }

    public async settings(data : SettingsInterface, clientUrl : string, setupUrl : string) {
        await this.installHandler.saveSettings(data,setupUrl,clientUrl,this.settingsSrc);
        constants.setConstant("setup-status", 1);
        constants.setConstant("settings", data);
    }

    private async move(file : SetupFile) {
        let ext = mime.extension(file.mimetype);
        let success = await FileTools.move(`upload/${file.fileName}`,`public/upload/${file.destName}.${ext}`);
    }

    public async setupData() : Promise<InstallerI>{
        return await this.installHandler.installationComplete(this.settingsSrc);
    }

    async complete() {
        let installer = await this.installHandler.getInstallerObject(this.settingsSrc);
        installer.done = true;
        await this.installHandler.saveInstallerObject(installer,this.settingsSrc);
    }
}

export interface SetupFile {
    fileName : string,
    mimetype: string,
    destName : string
}
