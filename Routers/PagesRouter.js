const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
router.get("/status",(req,res)=>
{ 
    return res.render("pages/status");
});
router.get(["/","/index","/main"],(req,res)=>
{
    mysql.connection.query(`SELECT expRate,dropRate,mesoRate,serverName FROM ${constants.getConstant("prefix")}_settings`,(err,results)=>
    {
        if(err) throw err;
        mysql.connection.query(`SELECT name,level,exp FROM characters ORDER BY level DESC LIMIT 6`,(err,players)=>
        {
            if(err) throw err;
            return res.render("index",{user:req.session.user,settings:results[0],players:players}); 
        }); 
    }); 
});
router.get("/ranking",(req,res)=>
{ 
    return res.render("pages/ranking");
});
router.get("/dashboard",(req,res)=>
{ 
    if(!isLoggedIn(req)) return res.render("pages/login");
    let user = getUser(req);
    console.log(req.session.cookie.maxAge);
    if(user.gm == 0)
        return res.render("pages/dashboardUser");
    else if(user.gm >= 1)
        return res.render("pages/dashboardGM");    
});
function isLoggedIn(req)
{
    return req.session.user;
}
function getUser(req)
{
    return req.session.user;
}
module.exports = router;