const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
router.get(["/","/index","/main"],(req,res)=>
{
    mysql.connection.query(`SELECT name,level,exp FROM characters ORDER BY level DESC LIMIT 6`,(err,players)=>
    {
        if(err) throw err;
        return res.render("index",{user:req.session.user,players:players}); 
    }); 
});
router.get("/ranking",(req,res)=>
{ 
    return res.render("pages/ranking",{user:req.session.user});
});
router.get("/login",(req,res)=>
{
    if(req.session.user) res.redirect("dashboard");
    return res.render("pages/dashboardLogin");
});
router.get("/register",(req,res)=>
{ 
    if(req.session.user) res.redirect("dashboard");
    return res.render("pages/register");
});
router.get("/play",(req,res)=>
{ 
    mysql.connection.query(`SELECT * FROM ${constants.getConstant("prefix")}_downloads`,(err,data)=> res.render("pages/play",{user:req.session.user,downloads:data}));
});
router.get("/download",(req,res)=>
{ 
    return res.render("pages/play",{user:req.session.user});
});
router.get("/status",(req,res)=>
{ 
    return res.render("pages/status",{user:req.session.user});
});
router.get("/vote",(req,res)=>
{ 
    if(!req.session.user) return res.render("pages/dashboardLogin",{site:"vote"});
    return res.render("pages/vote",{user:req.session.user});
});
module.exports = router;