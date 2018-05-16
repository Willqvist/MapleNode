const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
const async = require("async");
router.get("/",(req,res)=>
{ 
    if(!isLoggedIn(req)) return res.render("pages/login");
    let user = getUser(req);
    console.log(req.session.cookie.maxAge);
    if(user.gm == 0)
        return renderDashboard(req,res);
    else if(user.gm >= 1)
        return renderGMDashboard(req,res);   
});
router.post("/votes/update",(req,res)=>
{ 
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    async.forEachOf(req.body.newValue,(page,key,callback)=>
        {
            let name = req.body.originalValue[key].name;
            mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_Vote SET nx='${page.nx}', name='${page.name}', url='${page.url}', time='${page.time}' WHERE name='${name}'`,(err,result)=>
            {
               return callback(err);
            });
        },(err)=>
        {
            if(err) throw err;
            res.send(JSON.stringify({success:true}));
        });
});
//USER FUNCTIONS
function isLoggedIn(req)
{
    return req.session.user;
}
function isAdmin(req)
{
    return (getUser(req).gm >= 1);
}
function getUser(req)
{
    return req.session.user;
}
function renderGMDashboard(req,res)
{
    mysql.connection.query(`SELECT name,nx,time,url FROM ${constants.getConstant("prefix")}_Vote`,(err,result)=>
    {
        res.render("pages/dashboardGM",{votes:result});
    });
}
function renderDashboard(req,res)
{
    res.render("pages/dashboardUser");
}
module.exports = router;