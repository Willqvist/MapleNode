//libaries
import express from "express";
import session from 'express-session';
import bodyParser from "body-parser";
import helmet from "helmet";
import * as consts from "./core/Constants";
import {HOME} from "./Paths";
import {UrlSlicer} from "./Middleware";
//const PacketHandler = require("../core/packets/PacketHandler");
import setup from "./setup";
import input from "./in";
import Logger from "./core/logger/Logger"
import cGen from "./scripts/CSSGenerator/CSSGenerator";
import {PalettesInterface, SettingsInterface} from "./core/Interfaces/DatabaseInterfaces";
import SetupRouter from "./routers/SetupRouter";
import {Server} from "http";
import MNHandler from "./setup/MNHandler";
import DatabaseConnection from "./core/database/DatabaseConnection";
import {ConfigInterface, getConfig, openConfig} from "./core/config/Config";
import {Database} from "./core/database/Database";
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
class App {
    private app : express.Application;
    private server : Server;
    private appConfig : ConfigInterface;
    constructor() {
        this.app = express();
        this.server = this.app.listen(input.port);
    }

    async init() {
        this.config();
        this.appConfig = await getConfig();
        await this.exitOnFailure(this.setupDatabase);
        await this.exitOnFailure(this.setup);
    }

    public getApp() : express.Application {
        return this.app;
    }

    public getConfig() : ConfigInterface {
        return this.appConfig
    }

    private config() {
        this.app.set('view engine', 'ejs');
        this.app.set("views",HOME+"/views");
        this.app.use(bodyParser.json({limit:'1000mb',}));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(helmet());
    }

    private async setupDatabase() : Promise<boolean> {
        let exists = this.getConfig().server.database.prefix.length != 0;
        if(exists) {
            try {
                await DatabaseConnection.createInstance(this.getConfig().server.database.instance, this.getConfig().server.database.auth);
            }
            catch(err) {
                Logger.warn("Could not connected to database.");
                if(err.errno)
                    Logger.error(`[${err.errno}] ${err.msg}`);
                else
                    Logger.error(err);
                return false;
            }
        }
        return true;
    }


    private async setup() : Promise<boolean> {
        await setup(this.server, this.setupListeners.bind(this), this.setupComplete.bind(this));
        return true;
    }

    private async await(func) : Promise<any> {
        return await func.bind(this)();
    }

    private async exitOnFailure(func) {
        let success = await this.await(func);
        if(!success)
            this.exit();
    }

    private setupListeners() {
        this.app.use(session(
            {
                secret:"XCDGREV34432",
                resave:false,
                saveUninitialized: true,
            }
        ));
        this.app.use(express.static(HOME+"/public",{redirect:false}));
        this.app.use(UrlSlicer);
        this.app.use("/setup",SetupRouter);

        //app.use("/",        route("GlobalRouter"));
        this.app.use(async (req,res,next)=>
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
        //app.use("/IO",         route("IORouter"));
        this.app.use((req, res, next)=>
        {
            Logger.log(`[${req.ip}] tried to visit ${req.originalUrl}`);
            res.status(404).render('error/404')
        });

    }

    private setupComplete() {
        this.app.locals.palette = consts.getConstant("palette");
        this.app.locals.heroImage = consts.getConstant("heroImage");
        this.app.locals.logo = consts.getConstant("logo");
        this.app.locals.settings = consts.getConstant("settings");
        Logger.log(`setup complete`);
        Logger.log(`${consts.getConstant<SettingsInterface>("settings").serverName} is Online on port ${input.port}`);
    }

    public exit() {
        this.server.close();
        process.exit(0);
        console.log("here!");
    }

    getDatabase() : Database{
        return this.getConfig().server.database.instance;
    }
}
const app = new App();
app.init();
export default app;
