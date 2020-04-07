//libaries
const main = require("./startup");
const express = require("express");
const async = require("async");
const session = require('express-session');
const fs = require("fs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const constants = require("./src/tools/Constants");
const PacketHandler = require("./src/packets/PacketHandler");
const setup  = require("./setup");
const input = require("./in");
const Logger = require("./src/logger/Logger");
const DBConn = require("./src/database/DatabaseConnection");
const IH = require("./src/tools/InstallationHandler");
//PacketHandler.setup();
/*
let data = {};
data.user = "root";
data.password = "";
data.host = "localhost";
data.database = "leaderms";
data.prefix = "MN";
DBConn.createInstance(main.getDatabase(),data);
new IH().setMysqlSetupComplete(data);
*/


//setup
let app = express();
let server = app.listen(input.port);

const io = require('socket.io').listen(server);
require("./src/tools/ProgressUpdater").init(io);

const cGen = require("./scripts/CSSGenerator/CSSGenerator");
PacketHandler.setupGlobalPackets(app);

app.set('view engine', 'ejs');
app.set("views",__dirname+"/views");
app.use(bodyParser.json({limit:'1000mb',extended: true})); 
app.use(bodyParser.urlencoded({limit:'1000mb',extended: true, parameterLimit: 1000000}));
app.use(helmet());

run();
async function run() {
    Logger.log("Starting server...");

    await main.onStart();

    setup(server, setupListeners, setupComplete);
}
//listeners
async function setupListeners(){
    app.use(session(
        {
            secret:"XCDGREV34432",
            resave:false,
            saveUninitialized: true,
        }
    ));
    app.use(express.static(__dirname+"/public"));

    app.use("/setup",   routeApp("SetupRouter"));
    //app.use("/",        route("GlobalRouter"));
    app.use((req,res,next)=>
    {
        cGen.generateCSS("#EFCB68","#3E78B2","#111111","#F4F4F4","#111111",()=>{});
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        req.ip = ip;
        //PacketHandler.handlePackets(app,req,res,next);
    });

    //app.use("/library",     route("LibraryRouter"));
    //app.use("/",            route("PagesRouter"));
    //app.use("/dashboard",   routeApp("DashboardRouter"));
    //app.use("/IO/",         route("IORouter"));
    app.use((req, res, next)=>
    {
        Logger.log(`[${req.ip}] tried to visit ${req.originalUrl}`);
        res.status(404).render('error/404')
    });
    //app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
}
async function setupComplete()
{
    app.locals.palette = constants.getConstant("palette");
    app.locals.heroImage = constants.getConstant("heroImage");
    app.locals.logo = constants.getConstant("logo");
    app.locals.settings = constants.getConstant("settings");
    Logger.log(`setup complete`);
    Logger.log(`${constants.getConstant("settings").serverName} is Online on port ${input.port}`);

}

function route(name) {
    return require("./routers/"+name);
}
function routeApp(name) {
    return route(name)(app);
}