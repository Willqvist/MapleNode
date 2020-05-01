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

    /**
     * sets the images in public/images
     * @param logo, the logo image
     * @param hero, the hero image
     */
    public async setDesign(logo? : SetupFile, hero? : SetupFile) {
        if(logo)
            await this.move(logo);
        if(hero)
            await this.move(hero);
    }

    /**
     * adds a new color palette to the database
     * @param name the name of the new palette
     * @param mainColor the main color of the palette
     * @param secondaryMainColor the secondary main color
     * @param fontColorDark font color dark, used on light backgrounds
     * @param fontColorLight font color light, used on dark backgrounds
     * @param fillColor fillColor.
     * @param active if active is 1, the palette will be set as the new active palette.
     */
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

    /**
     * connects to the database.
     * @param data, authentication for the database and prefix.
     */
    public async connectToDatabase(auth: DatabaseAuthInterface & {prefix: number}) {
        await DBConn.createInstance(app.getDatabase(), auth);
        let writer = await openConfig();
        await writer.write("server/database/prefix",auth.prefix);
        await writer.write("server/database/auth",auth);
        await this.installHandler.setMysqlSetupComplete(auth);
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
