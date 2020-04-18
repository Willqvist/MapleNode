import DatabaseConnection from "./core/database/DatabaseConnection";
import InstallationHandler from "./setup/InstallationHandler";
import * as consts from "./core/Constants";
import Logger from "./core/logger/Logger";
import {DesignInterface, PalettesInterface, SettingsInterface} from "./core/Interfaces/DatabaseInterfaces";
import {HOME} from "./Paths";
import {getConfig} from "./core/config/Config";

export default async function setup(server : any,setupListeners : ()=>void,setupComplete : ()=>void) : Promise<void>{

    let installer = new InstallationHandler();
    setupListeners();
    let data;
    let config = await getConfig();
    let prefix = config.server.database.prefix;
    try{
    data = await installer.getInstallerObject("/settings/setup.MN");
    }catch(err) {
        Logger.log("To begin setup, visit /setup");
        return;
    }
    if(!data.mysqlSetupComplete) {
        Logger.log("To begin setup, visit /setup");
        return;
    }
    if(data.prefix)
    {
        consts.setConstant("prefix",prefix);
        consts.setConstant("realPath",HOME);
    }
    if(data.mysqlSetupComplete) {
        try {
        let settings = await DatabaseConnection.instance.getSettings();
        let design = await DatabaseConnection.instance.getDesign({select:["heroImage","logo"]});
        let palette = await DatabaseConnection.instance.getActivePalette();
        setConstants(settings,design,palette);
        } catch(err) {
            console.log("ERROR HERE: ",err);
        }
    }
    if(!data.done){
        consts.setConstant("setup-status",-1);
        Logger.warn("setup incomplete: visit localhost/setup");
    } else {
        setupComplete();
    }
}

function setConstants(settings : SettingsInterface,design : DesignInterface,palette : PalettesInterface) {
    consts.setConstant("settings",settings);
    consts.setConstant("heroImage",design.heroImage);
    consts.setConstant("logo",design.logo);
    consts.setConstant("palette",palette);
}
