const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
let mcg = new MapleCharacterGenerator(mysql.connection,60*5);
let installHandler = new InstallHandler(mysql.mysql);
router.post("/login",(req,res)=>
{
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
});
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
        console.log(sql);
        mysql.connection.query(sql,queryData,(err,result)=>
        {
            console.log("wew");
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
router.get("/ranking/:player",(req,res,next)=>
{
    next();
});


module.exports = router;