import DatabaseConnection from "./src/database/DatabaseConnection";
import InstallationHandler from "./src/tools/InstallationHandler";
import * as consts from "./src/tools/Constants";
import Logger from "./src/logger/Logger";
import {DesignInterface, PalettesInterface, SettingsInterface} from "./src/database/DatabaseInterfaces";
export default async function setup(server : any,setupListeners : ()=>void,setupComplete : ()=>void) : Promise<void>{

    let installer = new InstallationHandler();
    setupListeners();
    let data;
    try{
    data = await installer.getInstallerObject("/settings/setup.MN");
    }catch(err) {
        Logger.log("To begin setup, visit /setup");
        return;
    }
    if(data.done && data.prefix)
    {
        try {
            consts.setConstant("prefix",data.prefix);
            consts.setConstant("realPath",__dirname);
            let settings = await DatabaseConnection.instance.getSettings();
            let design = await DatabaseConnection.instance.getDesign({select:["heroImage","logo"]});
            let palette = await DatabaseConnection.instance.getActivePalette();
            setConstants(settings,design,palette);
            setupComplete();
        } catch(err) {
            console.log(err);
        }
    }
    else{
        consts.setConstant("setup-status",-1);
        Logger.warn("setup incomplete: visit localhost/setup");
    }
}

function setConstants(settings : SettingsInterface,design : DesignInterface,palette : PalettesInterface) {
    consts.setConstant("settings",settings);
    consts.setConstant("heroImage",design.heroImage);
    consts.setConstant("logo",design.logo);
    consts.setConstant("palette",palette);
}
