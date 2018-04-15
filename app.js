const MapleCharacterGenerator = require("./MapleCharacterGenerator/MCG");
const express = require("express");
const mysql = require("mysql");
const fs = require("fs");
const bodyParser = require("body-parser");
const MNHandler = require("./Tools/MNHandler");
const SetupRouter = require("./Routers/setupRouter.js");
const InstallationHandler = require("./Tools/InstallationHandler");
let app = express();
let mysqlCon;
let installHandler = new InstallationHandler(mysqlCon);
let mnHandler = new MNHandler();
let mcg;

app.listen(8081);
app.set('view engine', 'ejs');
app.set("views",__dirname+"/public");
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 
if(mnHandler.isDatabaseSetup())
{
    let data = mnHandler.getMysql();
    mysqlCon = mysql.createConnection(data);
    mcg = new MapleCharacterGenerator(mysqlCon,60*5);
}

app.locals.printStatement = function(statement,callback)
{
  if(statement)
    return callback();
  return "";  
}
app.locals.isset = function(variable)
{
  console.log("VARIABLE",variable);
  if(variable === "undefined") return false;
  return true;
}
app.get("*.ejs",(req,res)=>res.status(404).render("error/404"));
app.use(express.static(__dirname+"/public"));
app.get("/Characters/*.chr",(req,res)=>
{
    let name = req.url.replace("/Characters/","").replace(".chr","");
    mcg.generatePlayer(name,(req)=>{
        if(!req.success)
        {
            console.log(req.reason);
            if(req.errorID == mcg.error.INVALID_PLAYER)
            {
                res.contentType('image/png');
                return res.sendFile("MapleCharacterGenerator/Characters/undefined.png",{root:__dirname});
            }
        }
        res.contentType('image/png');
        res.sendFile("MapleCharacterGenerator/Characters/"+name+".png",{root:__dirname});
    });
});
app.all("*",(req,res,next)=>
{
    installHandler.installationComplete((done,data)=>
    {
        let isSetupDirectory = (req.url.substring(1,7) == "setup/");
        if(done && isSetupDirectory){
            return res.redirect("/");
        }   
        if(!done && !isSetupDirectory)
        {
            return res.redirect("/setup/");
        }
        return next();
    });
});
app.use("/setup",SetupRouter);
app.get(["/","/index"],(req,res)=>
{
    return res.render("index");   
});
app.use((req, res, next)=>res.status(404).render('error/404'));
//app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
module.exports =
{
    mysql:mysqlCon
};