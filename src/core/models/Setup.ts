import InstallationHandler from "../../setup/InstallationHandler";
import FileTools from "../tools/FileTools";
import mime from 'mime-types';
import DBConn from "../database/DatabaseConnection";
import app from "../../app";
import mnHandler from "../../setup/MNHandler";
import {SettingsInterface} from "../Interfaces/DatabaseInterfaces";
import * as constants from "../Constants";

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

    public async connectToDatabase(data: any) {
        await DBConn.createInstance(app.getDatabase(), data);
        await mnHandler.saveMysql(data);
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

    public async setupData(){
        return await this.installHandler.installationComplete(this.settingsSrc);
    }
}

export interface SetupFile {
    fileName : string,
    mimetype: string,
    destName : string
}
