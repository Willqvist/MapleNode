const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
let mcg = new MapleCharacterGenerator(mysql.connection,60*5);
let installHandler = new InstallHandler(mysql.mysql);
router.get("/Characters/*.chr",(req,res)=>
{
    let realPath = constants.getConstant("realPath");
    let name = req.url.replace("/Characters/","").replace(".chr","");
    console.log("Ew");
    mcg.generatePlayer(mysql.connection,name,(req)=>{
        if(!req.success)
        {
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
router.all("/*",(req,res,next)=>
{
    if(!constants.getConstant("prefix") || constants.getConstant("setup-status") == -1)
        return res.redirect("/setup/");
    return next();
});
module.exports = router;