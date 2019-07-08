const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const md5 = require("md5");
const Logger = require("../Logger/Logger");

let mcg = new MapleCharacterGenerator(mysql.connection,60*5);
let installHandler = new InstallHandler(mysql.mysql);
router.post("/login",(req,res)=>
{
    setTimeout(()=>{
        mysql.connection.query(`SELECT id,name,gm FROM accounts WHERE name = ? AND password = ?`,[req.body.username,md5(req.body.password)],(err, result, fields)=>
        {
            let data = {};
            data.success = true;
            data.loggedin = false;
            data.reason = "Wrong username or password";
            if(result.length >= 1)
            {
                data.loggedin = true;
                data.reason = "You have successfully loggedin!";
                console.log(req.session);
                req.session.user = {name:result[0].name,id:result[0].id,gm:result[0].gm};
                let hour = 3600000/2;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
                Logger.log("["+req.ip+"] " + req.body.username + " loggedin");
            }
            else
            {
                Logger.log("["+req.ip+"] tried to login with username " + req.body.username + "");
            }
            res.send(JSON.stringify(data)); 
        });
    },100);
});
router.post("/register",(req,res)=>
{
    /*
    setTimeout(()=>{
        mysql.connection.query(`SELECT id,name,gm FROM accounts WHERE name = ? AND password = ?`,[req.body.username,req.body.password],(err, result, fields)=>
        {
            let data = {};
            data.success = true;
            data.loggedin = false;
            data.reason = "Wrong username or password";
            if(result.length >= 1)
            {
                data.loggedin = true;
                data.reason = "You have successfully loggedin!";
                console.log(req.session);
                req.session.user = {name:result[0].name,id:result[0].id,gm:result[0].gm};
                let hour = 3600000/2;
                req.session.cookie.expires = new Date(Date.now() + hour);
                req.session.cookie.maxAge = hour;
            }
            res.send(JSON.stringify(data)); 
        });
    },00);
    */
   setTimeout(()=>{
   let data = req.body;
   if(isBetween(data.username.length,3,15) && isBetween(data.username.length,3,15))
   {
        if(data.c_password == data.password)
        {
            if(data.c_email == data.email)
            {
                if(data.year > 1800)
                {
                    mysql.connection.query(`INSERT INTO accounts (name,password,birthday,email) VALUES('${data.username}','${md5(data.password)}','${data.year}-${data.month}-${data.day}','${data.email}')`,(err,result)=>
                    {
                        if(err) throw err;
                        Logger.log("["+req.ip+"] " + data.username + " registered");
                        res.send(JSON.stringify({success:true,error:"Register complete! You will be directed to a new page in 3 sec..."}));
                    });
                }
                else
                {
                    res.send(JSON.stringify({success:false,error:"Are you really over 200 years old?"}));
                }
            }
            else
            {
                res.send(JSON.stringify({success:false,error:"Emails does not match"}));
            }
        }
        else
        {
            res.send(JSON.stringify({success:false,error:"Passwords does not match"}));
        }
   }
   else
   {
       res.send(JSON.stringify({success:false,error:"username and password most be between 3 and 15 characters"}));
   }
},2000);
});
function isBetween(data,min,max)
{
    return data > min && data < max;
}
router.post("/ranking",(req,res)=>
{
    let jobs = constants.getConstant("jobs");
    let whereString = "";
    let job = jobs[req.body.job];
    let whereStatement = "WHERE";
    let queryData = [];
    let orderBy = "Level";
    console.log("JOB",job,req.body.job);
    if(typeof req.body.search !== 'undefined')
    {
        whereString += ` ${whereStatement} name LIKE ?`;
        queryData.push("%" + req.body.search + "%");
        whereStatement = "AND";
    }
    if(req.body.job !== 'undefined' && req.body.job != -1)
    {
        whereString += ` ${whereStatement} job = ?`;
        queryData.push(req.body.job);
        whereStatement = "AND";
    }
    if(req.body.rank === "Fame")
        orderBy = "Fame"; 
    queryData.push(Math.max(parseInt(req.body.page),0)*5);
    /*
    let sql = `
    SELECT player.rank,
    player.name,
    player.level,
    player.job,
    player.exp,
    FROM (SELECT characters.name,
                 characters.level,
                 characters.job,
                 characters.exp,
                 @rownum := @rownum + 1 AS rank
                 FROM characters JOIN (SELECT @rownum := 0) r ORDER BY characters.${orderBy} DESC) player,
    () ${whereString} LIMIT 5 OFFSET ?`;
    */
    let sql = 
    `
    SELECT 
    player.name,
    player.level,
    player.job,
    player.fame,
    player.jobRank,
    player.rank
    FROM
        (SELECT 
            player.name,
                player.level,
                player.job,
                player.fame,
                player.rank,
                @job:=CASE
                    WHEN job <> @prev THEN 1
                    ELSE @job + 1
                END AS jobRank,
                @prev:=job
        FROM
            (SELECT 
            name, level, job, fame, @rank:=@rank + 1 AS rank
        FROM
            characters, (SELECT @rank:=0, @job := 0, @prev := 'string') AS r
        ORDER BY ${orderBy} DESC , NAME DESC) AS player
        ORDER BY player.job DESC , ${orderBy} DESC) AS player ${whereString}
    ORDER BY ${orderBy} DESC , name DESC LIMIT 5 OFFSET ?
    `;
    setTimeout(()=>
    {
        mysql.connection.query(sql,queryData,(err,result)=>
        {
            if(err)
                throw err;
            let jobs = constants.getConstant("jobs");
            for(let i = 0; i < result.length; i++)
                result[i].job = (!jobs[result[i].job]) ? "?" : jobs[result[i].job];
            console.log(result);
            res.send(JSON.stringify(result));  
        })
    },200);
});
router.post("/search",(req,res)=>
{
    let search = req.body.search;
    if(search.length == 0)
    return res.send(JSON.stringify({empty:"search for a word"}));
    let cat = req.body.category;
    let menus = ["home","forum","vote","play","ranking","sign up","login"];
    let sql_players = `SELECT name FROM characters WHERE name LIKE'%${search}%'`;

    if(cat == 'menu' || cat == 'all')
    //let sql_items = `SELECT name FROM characters WHERE name like ${search}`;
    mysql.connection.query(sql_players,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({players:result,pages:menus.filter(w=>w.includes(search))}));

    });
        
});
router.get("/ranking/:player",(req,res,next)=>
{
    next();
});


module.exports = router;