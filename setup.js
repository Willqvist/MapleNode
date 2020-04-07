const InstallationHandler = require("./src/tools/InstallationHandler");
const constants = require("./src/tools/Constants");
const Logger = require("./src/logger/Logger");
const DBConnection = require("./src/database/DatabaseConnection");
async function setup(server,setupListeners,setupComplete){
    let installer = new InstallationHandler();
    let data = await installer.getInstallerObject();
    setupListeners();
    if(!data.prefix)
    {
        Logger.warn("prefix value is not set... have you finished setup? go to: localhost:" + server.address().port + "/setup/");
    }
    else
    {
        constants.setConstant("prefix",data.prefix);
        constants.setConstant("realPath",__dirname);
    }
    if(data.done && data.prefix)
    {
        let [settings,err] = await DBConnection.instance.getSettings();
        let [design,errDesign] = await DBConnection.instance.getDesign({select:["heroImage","logo"]});
        let [palette,errPalette] = await DBConnection.instance.getActivePalette();
        setConstants(settings,design,palette);
        setupComplete();
    }
    else{
        constants.setConstant("setup-status",-1);
        Logger.warn("setup incomplete: visit localhost/setup");
    }
}

function setConstants(settings,design,palette) {
    constants.setConstant("settings",settings[0]);
    constants.setConstant("heroImage",design[0].heroImage);
    constants.setConstant("logo",design[0].logo);
    constants.setConstant("palette",palette[0]);
}
module.exports = setup;