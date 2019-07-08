const InstallationHandler = require("./Tools/InstallationHandler");
const mysql = require("./Tools/mysql.js").getMysql();
const constants = require("./Tools/Constants");
const Library = require("./Tools/Library").getLibrary();
const Logger = require("./Logger/Logger");
function setup(setupListeners,setupComplete){
    Logger.log("Starting server...");
    mysql.instantiate((err)=>
    {

        if(err){ Logger.error("Mysql connection failed!"); process.exit(0); }
        else     Logger.log("Mysql connected");
        let installer = new InstallationHandler();
        installer.getInstallerObject((data)=>
        {
            setupListeners();
            if(!data.prefix)
            {
                Logger.warn("prefix value is not set... have you finished setup?");
            }
            else
            {
                constants.setConstant("prefix",data.prefix);
                constants.setConstant("realPath",__dirname);
            }    
            if(data.done && data.prefix)
            {
                Library.setMysql(mysql);
                mysql.connection.query(`SELECT * FROM ${data.prefix}_settings`,(err,results)=>
                {
                    constants.setConstant("settings",results[0]);
                    mysql.connection.query(`SELECT * FROM ${data.prefix}_design`,(err,design)=>
                    {
                        if(err) throw err;
                        constants.setConstant("heroImage",design[0].heroImage);
                        constants.setConstant("logo",design[0].logo);
                        mysql.connection.query(`SELECT * FROM ${data.prefix}_palettes WHERE active='1'`,(err,result)=>
                        {
                            if(err) throw err;
                            
                            constants.setConstant("palette",result[0]);
                            setupComplete();
                        });
                    });
                });
            }
            else{
                constants.setConstant("setup-status",-1);
                Logger.warn("setup incomplete"); 
                }   
        });
    });
}
module.exports = setup;