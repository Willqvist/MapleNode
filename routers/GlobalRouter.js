const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const constants = require("../src/tools/Constants");
let mcg = new MapleCharacterGenerator(60*5);
router.get("/Characters/*.chr",(req,res)=>
{
    let realPath = constants.getConstant("realPath");
    let name = req.url.replace("/Characters/","").replace(".chr","");
    mcg.generatePlayer(name,(req)=>{
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