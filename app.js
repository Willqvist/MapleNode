const MapleCharacterGenerator = require("./MapleCharacterGenerator/MCG");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const MNHandler = require("./Tools/MNHandler");
const SetupRouter = require("./Routers/setupRouter");
const GlobalRouter = require("./Routers/GlobalRouter");
const InstallationHandler = require("./Tools/InstallationHandler");
const mysql = require("./Tools/mysql.js").getMysql();
const constants = require("./Tools/Constants");
const Rules = require("./Tools/Rules");
const helmet = require("helmet");
let app = express();
app.listen(8081);
app.set('view engine', 'ejs');
app.set("views",__dirname+"/public");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet()); 
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
                mysql.connection.query(`SELECT * FROM ${data.prefix}_settings`,(err,results)=>
                {
                    let stringLen = 18 - results[0].serverName.length;
                    let a = " ".repeat(stringLen);
                    constants.setConstant("settings",results[0]);
                    console.log(`║ \x1b[32m-setup complete \x1b[37m            ║\r\n║ ${results[0].serverName} is Online${a}║ \r\n╚═════════════════════════════╝ `,"\x1b[0m");
                });
            }
            else
                console.log("║ \x1b[31m-setup incomplete","\x1b[0m          ║ \r\n╚═════════════════════════════╝");    
    });
});
//listeners
function setupListeners(){
    app.get("*.ejs",(req,res)=>res.status(404).render("error/404"));
    app.use(express.static(__dirname+"/public"));
    app.use("/setup",SetupRouter);
    app.use("/",GlobalRouter);
    app.use((req, res, next)=>res.status(404).render('error/404'));
    //app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
}

//EJS functions
app.locals.printStatement = function(statement,callback)
{
  if(statement)
    return callback();
  return "";  
}

app.locals.isset = function(variable)
{
    return variable !== "undefined";
}