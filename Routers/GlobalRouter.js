const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
let mcg = new MapleCharacterGenerator(mysql.connection,60*5);
let installHandler = new InstallHandler(mysql.mysql);
router.get("/Characters/*.chr",(req,res)=>
{
    let realPath = constants.getConstant("realPath");
    let name = req.url.replace("/Characters/","").replace(".chr","");
    mcg.generatePlayer(mysql.connection,name,(req)=>{
        if(!req.success)
        {
            console.log(req.reason);
            if(req.errorID == mcg.error.INVALID_PLAYER)
            {
                res.contentType('image/png');
                return res.sendFile("/MapleCharacterGenerator/Characters/undefined.png",{root:realPath});
            }
        }
        res.contentType('image/png');
        res.sendFile("/MapleCharacterGenerator/Characters/"+name+".png",{root:realPath});
    });
});
router.all("*",(req,res,next)=>
{
    if(!constants.getConstant("prefix"))
        return res.redirect("/setup")
    return next();
});
router.get(["/","/index"],(req,res)=>
{
    mysql.connection.query(`SELECT expRate,dropRate,mesoRate,serverName FROM ${constants.getConstant("prefix")}_settings`,(err,results)=>
    {
        return res.render("index",{settings:results[0]});  
    }); 
});
module.exports = router;