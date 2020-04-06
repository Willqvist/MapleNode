const express = require("express");
const router = express.Router();
const mysql = require("../Tools/mysql").getMysql();
const constants = require("../Tools/Constants");
router.get(["/"],(req,res)=>
{
    return res.render("index"); 
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
    mysql.connection.query(`SELECT * FROM ${constants.getConstant("prefix")}_vote`,(err,data)=> res.render("pages/vote",{user:req.session.user,votes:data}));
});
module.exports = router;