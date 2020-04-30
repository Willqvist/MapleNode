import express from "express";
import MapleCharacterGenerator from "../MapleCharacterGenerator/MCG";
import InstallHandler from "../setup/InstallationHandler";
import * as constants from "../core/Constants";
import Logger from "../core/logger/Logger";
import DatabaseConnection from "../core/database/DatabaseConnection";
import IO from "../models/IO";
import md5 from "md5";
import {AccountsInterface} from "../core/Interfaces/DatabaseInterfaces";

const router = express.Router();
const Database = DatabaseConnection.getInstance();
const io = new IO();
let mcg = new MapleCharacterGenerator(60*5);
let installHandler = new InstallHandler();

/**
 * REST api on post to /login.
 * body:
 * ```
 * {
 *     username:string,
 *     password:string
 * }
 * ```
 */
router.post("/login",async (req,res)=>
{
    let response = await io.login(req.session,req.body.username,md5(req.body.password));
    if(response.REST.success)
    {
        Logger.log("debug","["+req.ip+"] " + req.body.username + " loggedin");
    }
    else
    {
        Logger.log("debug","["+req.ip+"] tried to login with username " + req.body.username + "");
    }
    res.send(JSON.stringify(response.REST));
});

/**
 * REST api on post to /register.
 * body:
 * ```
 * {
 *     username:string,
 *     password:string,
 *     c_password:string // confirmed password
 *     year:number,
 *     month:number,
 *     day:number,
 *     email:string
 *     c_email:string // confirmed email
 * }
 * ```
 */
router.post("/register",async (req,res)=>
{
   let body = req.body;

   if(!isBetween(body.username.length,3,15) && isBetween(body.username.length,3,15))
       return sendJSON(res,{success:false,error:"Username and password most be between 3 and 15 characters"});
    if(body.c_password != body.password)
        return sendJSON(res,{success:false,error:"Passwords does not match"});
    if(body.c_email != body.email)
        return sendJSON(res,{success:false,error:"Emails does not match"});
    if(body.year <= 1800)
        return sendJSON(res,{success:false,error:"Are you really over 200 years old?"});

    let response = await io.register(req.session,body.username,md5(body.password),new Date(body.year,body.month,body.day),body.email);
    Logger.log("debug","["+req.ip+"] " + body.username + " registered");

    return sendJSON(res,{success:true,error:"Register complete! You will be directed to a new page in 3 seconds..."});
});
function isBetween(data,min,max)
{
    return data > min && data < max;
}

function sendJSON(res,json) {
    return res.send(JSON.stringify(json));
}

router.get("/vote/:name",async (req,res)=>
{

    let { name } = req.params;
    let acc: AccountsInterface = await io.getAccountByName(name);
    if(!acc) return res.send(JSON.stringify({success:false,reason:"Could not find username"}));
    let votes = await io.getVotes(acc.id);
    if(votes.length >= 1)
    {
        let ids = [];
        for(let i = 1; i < votes.length; i++)
        {
            ids.push(votes[i].voteid);
        }

        let voteSites = DatabaseConnection.instance.getVotes({where: {id: ids}});
        return res.send(JSON.stringify({success:true,reason:"Found username",userid:acc.id, occupied:votes,votes:voteSites}));
    }
    else
    {
        return res.send(JSON.stringify({success:true,reason:"Found username",userid:acc.id, occupied:votes,votes:[]}));
    }
});
router.post("/vote",(req,res)=>
{
    /*
    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_voting (accountid,voteid) VALUES('${req.body.accid}','${req.body.id}')`,(err,result)=>
    {
        return res.send(JSON.stringify({success:true,reason:"Found username"}));
    });

     */
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
    /*
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
*/
});
router.post("/search",(req,res)=>
{
    /*
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
    */
});
router.get("/ranking/:player",(req,res,next)=>
{
    next();
});

export default router;
