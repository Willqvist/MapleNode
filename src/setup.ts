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
    data = await installer.getInstallerObject();
    }catch(err) {
        Logger.log("To begin setup, visit /setup");
        return;
    }
    console.log("setup!");

    if(!data.prefix)
    {
        Logger.warn("prefix value is not set... have you finished setup? go to: localhost:" + server.address().port + "/setup/");
    }
    else
    {
        consts.setConstant("prefix",data.prefix);
        consts.setConstant("realPath",__dirname);
    }
    if(data.done && data.prefix)
    {
        let [settings,err] = await DatabaseConnection.instance.getSettings();
        let [design,errDesign] = await DatabaseConnection.instance.getDesign({select:["heroImage","logo"]});
        let [palette,errPalette] = await DatabaseConnection.instance.getActivePalette();
        setConstants(settings,design,palette);
        setupComplete();
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
