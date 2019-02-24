const InstallationHandler = require("./Tools/InstallationHandler");
const mysql = require("./Tools/mysql.js").getMysql();
const constants = require("./Tools/Constants");
const Rules = require("./Tools/Rules");
const Library = require("./Tools/Library").getLibrary();

function setup(setupListeners,setupComplete){
    console.log("╔═════════════════════════════╗");
    console.log("║ launching...                ║");
    mysql.instantiate((err)=>
    {

        if(err){console.log("║ \x1b[31m-mysql connection failed...\x1b[0m ║ \r\n║ \x1b[31m-exiting process","\x1b[0m           ║\r\n╚═════════════════════════════╝"); process.exit(1);}
        else    console.log("║ \x1b[32m-mysql connected","\x1b[0m           ║");
        let installer = new InstallationHandler();
        installer.getInstallerObject((data)=>
        {
            setupListeners();
            if(!data.prefix)
            {
                console.log("║ \x1b[33m-prefix value is not set...\x1b[0m ║\r\n║ \x1b[33m have you finished setup?","\x1b[0m  ║");
            }
            else
            {
                constants.setConstant("prefix",data.prefix);
                constants.setConstant("realPath",__dirname);
                Rules.blockSelf.push("/setup/img");
                Rules.blockSelf.push("/setup/img/");
            }    
            if(data.done && data.prefix)
            {
                Library.setMysql(mysql);
                mysql.connection.query(`SELECT * FROM ${data.prefix}_settings`,(err,results)=>
                {
                    let stringLen = 18 - results[0].serverName.length;
                    let a = " ".repeat(stringLen);
                    constants.setConstant("settings",results[0]);
                    mysql.connection.query(`SELECT * FROM ${data.prefix}_design`,(err,design)=>
                    {
                        if(err) throw err;
                        constants.setConstant("heroImage",design[0].heroImage);
                        mysql.connection.query(`SELECT * FROM ${data.prefix}_palettes WHERE active='1'`,(err,result)=>
                        {
                            if(err) throw err;
                            constants.setConstant("palette",result[0]);
                            setupComplete();
                            console.log(`║ \x1b[32m-setup complete \x1b[37m            ║\r\n║ ${results[0].serverName} is Online${a}║ \r\n╚═════════════════════════════╝ `,"\x1b[0m");
                        });
                    });
                });
            }
            else{
                constants.setConstant("setup-status",-1);
                console.log("║ \x1b[31m-setup incomplete","\x1b[0m          ║ \r\n╚═════════════════════════════╝"); 
                }   
        });
    });
}
module.exports = setup;