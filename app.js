
process.stdin.resume();
process.stdin.setEncoding('utf8');
//libaries
const express = require("express");
const async = require("async");
const session = require('express-session');
const fs = require("fs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const constants = require("./Tools/Constants");
const PacketHandler = require("./packets/PacketHandler");
const InputListener = require("./Tools/InputListener");
const Logger = require("./Logger/Logger");
PacketHandler.setup();

//tools
const stdIn = getStdinVars();
if(stdIn.logger)
{
    Logger.setLogger(Logger.loggers.exe);
}
stdIn.port = !stdIn.port ? 80 : stdIn.port;
//setup
let app = express();
let server = app.listen(stdIn.port);
app.set('view engine', 'ejs');
app.set("views",__dirname+"/views");
app.use(bodyParser.json({limit:'1000mb',extended: true})); 
app.use(bodyParser.urlencoded({limit:'1000mb',extended: true, parameterLimit: 1000000}));
app.use(helmet()); 
require("./setup")(server,setupListeners,setupComplete);

const io = require('socket.io').listen(server);
require("./Tools/ProgressUpdater").init(io);

//routers
const SetupRouter = require("./Routers/setupRouter")(app);
const GlobalRouter = require("./Routers/GlobalRouter");
const IORouter = require("./Routers/IORouter");
const PagesRouter = require("./Routers/PagesRouter");
const DashboardRouter = require("./Routers/DashboardRouter")(app);
const mysql = require("./Tools/mysql").getMysql();
const LibraryRouter = require("./Routers/LibraryRouter");
PacketHandler.setupGlobalPackets(app);


//listeners
function setupListeners(){
    app.use(session(
        {
            secret:"XCDGREV34432",
            resave:false,
            saveUninitialized: true,
        }
    ));
    app.use(express.static(__dirname+"/public"));
    app.use("/setup",SetupRouter);
    app.use("/",GlobalRouter);
    const cGen = require("./scripts/CSSGenerator/CSSGenerator");
    app.use((req,res,next)=>
    {
        cGen.generateCSS("#EFCB68","#3E78B2","#111111","#F4F4F4","#111111",()=>{});
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        req.ip = ip;
        PacketHandler.handlePackets(app,req,res,next);
    });
    app.use("/library",LibraryRouter);
    app.use("/",PagesRouter);
    app.use("/dashboard",DashboardRouter);
    app.use("/IO/",IORouter);
    app.use((req, res, next)=>
    {
        Logger.log(`[${req.ip}] tried to visit ${req.originalUrl}`);
        res.status(404).render('error/404')
    });
    //app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
}
function setupComplete()
{
    Logger.log(`setup complete`);
    Logger.log(`${constants.getConstant("settings").serverName} is Online on port ${stdIn.port}`);

    app.locals.palette = constants.getConstant("palette");
    app.locals.heroImage = constants.getConstant("heroImage");
    app.locals.logo = constants.getConstant("logo");
    
    mysql.connection.query(`SELECT expRate,dropRate,mesoRate,serverName FROM ${constants.getConstant("prefix")}_settings`,(err,results)=>
    {
        if(err) throw err;
        app.locals.settings = results[0];
        constants.setConstant("settings",app.locals.settings);
    }); 
}


//instansiating constants
constants.setConstant("jobs",
{
    '-1':"Overall",
    '100':"Mage",
    '0':"Beginner",
    '200':"Warrior",
});
constants.setConstant("jobMethod",(jobs,name)=>
{   
    for(let key in jobs)
    {
        if(jobs[key] === name) return key;
    }
    return -1;
});
constants.setConstant("urlPath");
constants.setConstant("type_mapper",
{
    "Consume":"Item",
    "Etc":"Item",
    "Cash":"Item",
    "Pet":"Item",
    "Install":"Item",
    "Equip":"Eqp",
    "Eqp":"Eqp",
    "Mob":"Mob"
}
);
constants.setConstant("icon_mapper",
{
    "Item":"icon",
    "Eqp":"icon",
    "Mob":"stand_0"
}
);
constants.setConstant("MCG","Xml");



//PROCESS INPUT
process.stdin.on('data', function (text) {

    if(text.charAt(0) == '-')
    {
        return getInputVariables(text.split(' '));
    }
});

InputListener.listen("stop",(data)=>
{
    process.exit(1);
});

InputListener.listen("ping",(data)=>
{
    Logger.log("pong");
});
InputListener.listen("sql",(data)=>
{
    let sqlData = data.join(" ");
    mysql.connection.query(sqlData,(err,result)=>
    {
        if(err) 
        {
            Logger.warn("Error in sql command: " + sql);
            return;
        }
    });
});



//INPUT HELPER METHODS
function getStdinVars()
{
    let data = {_:[]};
    for (let i = 0; i < process.argv.length; i++) {  
        let arg = process.argv[i];
        if(arg.charAt(0) == "-")
        {
            let a = "";
            if(i+1 < process.argv.length && process.argv[i+1].charAt(0) != '-')
                a = process.argv[i+1];
            if(a.length == "") a = "empty";
            data[arg.substring(1)] = a;
        }
    }
    return data;
}

function getInputVariables(data,start=0)
{
    let variable = data[start].substring(1);
    data.shift();
    let i = start;
    let attribs = data;
    data.forEach(element => {
        if(element.charAt(0) == "-")
        {
            attribs = attribs.slice(start,i);
            return getInputVariables(data,i);
        }
        i++;
    });

    InputListener.recive(variable.trim(),attribs);
}






//CLEANUP ON EXIT
function exitHandler(options, exitCode) {
    console.log("-exitting");
    if (options.exit)
    {
        Logger.log("exiting process");
        process.exit(1);
    }
}

process.on('exit', (code)=>
{
    Logger.log("exiting process: " + code);
});
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on("uncaughtException",(err,origin)=>{
    Logger.error(err);
});