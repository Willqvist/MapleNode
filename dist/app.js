"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//libaries
const main = __importStar(require("./startup"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const consts = __importStar(require("./src/tools/Constants"));
//const PacketHandler = require("../src/packets/PacketHandler");
const setup_1 = __importDefault(require("./setup"));
const in_1 = __importDefault(require("./in"));
const Logger_1 = __importDefault(require("./src/logger/Logger"));
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
let app = express_1.default();
let server = app.listen(in_1.default.port);
const socket_io_1 = __importDefault(require("socket.io"));
socket_io_1.default.listen(server);
const CSSGenerator_1 = __importDefault(require("./scripts/CSSGenerator/CSSGenerator"));
const SetupRouter_1 = __importDefault(require("./routers/SetupRouter"));
//PacketHandler.setupGlobalPackets(app);
app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use(body_parser_1.default.json({ limit: '1000mb', extended: true }));
app.use(body_parser_1.default.urlencoded({ limit: '1000mb', extended: true, parameterLimit: 1000000 }));
app.use(helmet_1.default());
run().then(() => { });
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        Logger_1.default.log("Starting server...");
        yield main.onStart();
        yield setup_1.default(server, setupListeners, setupComplete);
    });
}
//listeners
function setupListeners() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(express_session_1.default({
            secret: "XCDGREV34432",
            resave: false,
            saveUninitialized: true,
        }));
        app.use(express_1.default.static(__dirname + "/public"));
        console.log("setu2 p!");
        app.use("/setup", SetupRouter_1.default(app));
        console.log("setu3 p!");
        //app.use("/",        route("GlobalRouter"));
        app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let paletteInterface = {
                name: 'Happy Green',
                mainColor: '#69DC9E',
                secondaryMainColor: '#3E78B2',
                fontColorLight: '#D3F3EE',
                fontColorDark: '#20063B',
                fillColor: '#CC3363'
            };
            yield CSSGenerator_1.default.generateCSS(paletteInterface);
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            req.ip = ip;
            //PacketHandler.handlePackets(app,req,res,next);
        }));
        //app.use("/library",     route("LibraryRouter"));
        //app.use("/",            route("PagesRouter"));
        //app.use("/dashboard",   routeApp("DashboardRouter"));
        //app.use("/IO/",         route("IORouter"));
        app.use((req, res, next) => {
            Logger_1.default.log(`[${req.ip}] tried to visit ${req.originalUrl}`);
            res.status(404).render('error/404');
        });
        //app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
    });
}
function setupComplete() {
    return __awaiter(this, void 0, void 0, function* () {
        app.locals.palette = consts.getConstant("palette");
        app.locals.heroImage = consts.getConstant("heroImage");
        app.locals.logo = consts.getConstant("logo");
        app.locals.settings = consts.getConstant("settings");
        Logger_1.default.log(`setup complete`);
        Logger_1.default.log(`${consts.getConstant("settings").serverName} is Online on port ${in_1.default.port}`);
    });
}
function route(name) {
    return require("./routers/" + name);
}
function routeApp(name) {
    return route(name)(app);
}
//# sourceMappingURL=app.js.map