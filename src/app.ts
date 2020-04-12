//libaries
import * as main from "./startup";
import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import helmet from "helmet";
import * as consts from "./src/tools/Constants";
import {HOME} from "./Paths";
import {UrlSlicer} from "./Middleware";
//const PacketHandler = require("../src/packets/PacketHandler");
import setup from "./setup";
import input from "./in";
import Logger from "./src/logger/Logger"

import path from 'path';

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
import cGen from "./scripts/CSSGenerator/CSSGenerator";
import {PalettesInterface, SettingsInterface} from "./src/database/DatabaseInterfaces";
import SetupRouter from "./routers/SetupRouter";
//PacketHandler.setupGlobalPackets(app);
app.set('view engine', 'ejs');
app.set("views",HOME+"/views");
app.use(bodyParser.json({limit:'1000mb',extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.use(UrlSlicer);

run().then((res)=>{
    if(!res) {
        server.close();
        process.exit(0);
    }
});

async function run() : Promise<boolean> {
    Logger.log("Starting server...");

    let res = await main.onStart();
    if(!res) return false;
    await setup(server, setupListeners, setupComplete);
    return true;
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

    app.use(express.static(HOME+"/public"));
    app.use("/setup",SetupRouter(app));

    //app.use("/",        route("GlobalRouter"));
    app.use(async (req,res,next)=>
    {
        let paletteInterface : PalettesInterface = {
            name:'Happy Green',
            mainColor:'#69DC9E',
            secondaryMainColor:'#3E78B2',
            fontColorLight:'#D3F3EE',
            fontColorDark:'#20063B',
            fillColor:'#CC3363'
        };
        await cGen.generateCSS(paletteInterface);
        //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        //req.ip = ip;
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
    app.locals.palette = consts.getConstant("palette");
    app.locals.heroImage = consts.getConstant("heroImage");
    app.locals.logo = consts.getConstant("logo");
    app.locals.settings = consts.getConstant("settings");
    Logger.log(`setup complete`);
    Logger.log(`${consts.getConstant<SettingsInterface>("settings").serverName} is Online on port ${input.port}`);

}

function route(name) {
    return require("./routers/"+name);
}
function routeApp(name) {
    return route(name)(app);
}