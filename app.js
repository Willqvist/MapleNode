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
let app = express();
app.listen(8081);
app.set('view engine', 'ejs');
app.set("views",__dirname+"/public");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 
mysql.instantiate((err)=>
{
    if(err) console.log("mysql setup failed");
    else    console.log("mysql setup completed");
    let installer = new InstallationHandler();
    installer.getInstallerObject((data)=>
    {
        if(!data.prefix)
        {
            console.log("prefix value is not set... have you finished setup?");
        }
        else
        {
            constants.setConstant("prefix",data.prefix);
            constants.setConstant("realPath",__dirname);
            setupListeners();
            if(data.done)
                console.log("setup complete");
            else
                console.log("setup incomplete");    
        }
    });
});
//listeners
function setupListeners(){
    app.get("*.ejs",(req,res)=>res.status(404).render("error/404"));
    app.use(express.static(__dirname+"/public"));
    app.use("/",GlobalRouter);
    app.use("/setup",SetupRouter);
    app.use((req, res, next)=>res.status(404).render('error/404'));
    app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
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