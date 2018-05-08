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
        mysql.connection.query(`SELECT name,level,exp FROM characters ORDER BY level DESC LIMIT 6`,(err,players)=>
        {
            console.log(err);
            return res.render("index",{settings:results[0],players:players}); 
        }); 
    }); 
});
router.get("/ranking",(req,res)=>
{ 
    return res.render("pages/ranking");
});
module.exports = router;