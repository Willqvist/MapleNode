
process.stdin.resume();
process.stdin.setEncoding('utf8');
//libaries
const express = require("express");
const async = require("async");
async.each([1,2,3,4,5],(item,next)=>
{
    next();
    console.log(item);
});
const session = require('express-session');
const fs = require("fs");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const constants = require("./Tools/Constants");
const Parser = require("./wz_parser/parser");
//setup
let app = express();
let server = app.listen(8081);
app.set('view engine', 'ejs');
app.set("views",__dirname+"/public");
app.use(bodyParser.json({limit:'1000mb'})); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet()); 
require("./setup")(setupListeners,setupComplete);

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
//listeners
function setupListeners(){
    app.use(session(
        {
            secret:"XCDGREV34432",
            resave:false,
            saveUninitialized: true,
        }
    ));
    app.get("*.ejs",(req,res)=>res.status(404).render("error/404"));
    app.use(express.static(__dirname+"/public"));
    app.use("/setup",SetupRouter);
    app.use("/library",LibraryRouter);
    app.use("/",GlobalRouter);
    app.use("/",PagesRouter);
    app.use("/dashboard",DashboardRouter);
    app.use("/IO/",IORouter);
    app.use((req, res, next)=>res.status(404).render('error/404'));
    //app.use((err, req, res, next)=>res.status(500).send('Something went wrong!'));
}
function setupComplete()
{
    app.locals.palette = constants.getConstant("palette");
    app.locals.heroImage = constants.getConstant("heroImage");
    constants.setConstant("urlPath");
    constants.setConstant("type_mapper",
    {
        "Consume":"Item",
        "Etc":"Item",
        "Cash":"Item",
        "Pet":"Item",
        "Install":"Item",
        "Equip":"Eqp",
        "Eqp":"Eqp"
        
    }
    );
    /*
    Parser.parse("./wz_parser/String.wz",({file,err})=>
    {
    });
    */
    mysql.connection.query(`SELECT expRate,dropRate,mesoRate,serverName FROM ${constants.getConstant("prefix")}_settings`,(err,results)=>
    {
        if(err) throw err;
        app.locals.settings = results[0];
        constants.setConstant("settings",app.locals.settings);
    }); 
}
process.stdin.on('data', function (text) {
    if (text.trim() === 'exit' || text.trim() === '!e') {
        console.log("exiting...");
      process.exit();
    }
});

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


//EJS functions
app.locals.printStatement = function(statement,callback)
{
  if(statement)
    return callback();
  return "";  
}
app.locals.jobs = constants.getConstant("jobs");
app.locals.isset = function(variable)
{
    return variable !== "undefined";
}
app.locals.expTable = [
    0, 15, 34, 57, 92, 135, 372, 560, 840, 1242, 1716, 2360, 3216, 4200, 5460, 7050, 8840,
   11040, 13716, 16680, 20216, 24402, 28980, 34320, 40512, 47216, 54900, 63666, 73080, 83720, 95700, 108480,
   122760, 138666, 155540, 174216, 194832, 216600, 240500, 266682, 294216, 324240, 356916, 391160, 428280, 468450,
   510420, 555680, 604416, 655200, 709716, 748608, 789631, 832902, 878545, 926689, 977471, 1031036, 1087536,
   1147032, 1209994, 1276301, 1346242, 1420016, 1497832, 1579913, 1666492, 1757815, 1854143, 1955750, 2062925,
   2175973, 2295216, 2420993, 2553663, 2693603, 2841212, 2996910, 3161140, 3334370, 3517093, 3709829, 3913127,
   4127566, 4353756, 4592341, 4844001, 5109452, 5389449, 5684790, 5996316, 6324914, 6671519, 7037118, 7422752,
   7829518, 8258575, 8711144, 9188514, 9692044, 10223168, 10783397, 11374327, 11997640, 12655110, 13348610,
   14080113, 14851703, 15665576, 16524049, 17429566, 18384706, 19392187, 20454878, 21575805, 22758159, 24005306,
   25320796, 26708375, 28171993, 29715818, 31344244, 33061908, 34873700, 36784778, 38800583, 40926854, 43169645,
   45535341, 48030677, 50662758, 53439077, 56367538, 59456479, 62714694, 66151459, 69776558, 73600313, 77633610,
   81887931, 86375389, 91108760, 96101520, 101367883, 106992842, 112782213, 118962678, 125481832, 132358236,
   139611467, 147262175, 155332142, 163844343, 172823012, 182293713, 192283408, 202820538, 213935103, 225658746,
   238024845, 251068606, 264827165, 279339639, 294647508, 310794191, 327825712, 345790561, 364739883, 384727628,
   405810702, 428049128, 451506220, 476248760, 502347192, 529875818, 558913012, 589541445, 621848316, 655925603,
   691870326, 729784819, 769777027, 811960808, 856456260, 903390063, 952895838, 1005114529, 1060194805,
   1118293480, 1179575962, 1244216724, 1312399800, 1384319309, 1460180007, 1540197871, 1624600714, 1713628833,
   1807535693, 1906558648, 2011069705, 2121276324
];