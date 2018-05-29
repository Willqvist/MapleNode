const express = require("express");
const router = express.Router();
const MapleCharacterGenerator = require("../MapleCharacterGenerator/MCG");
const mysql = require("../Tools/mysql").getMysql();
const InstallHandler = require("../Tools/InstallationHandler");
const constants = require("../Tools/Constants");
const Rules = require("../Tools/Rules");
const async = require("async");
const fs = require("fs");
let app;
router.get("/",(req,res)=>
{ 
    if(!isLoggedIn(req)) return res.render("pages/login");
    let user = getUser(req);
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
            if(!req.body.originalValue[key]) return callback();
            let name = req.body.originalValue[key].name;
            mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_Vote (nx,name,url,time) VALUES ('${page.nx}','${page.name}','${page.url}','${page.time}') ON DUPLICATE KEY UPDATE nx='${page.nx}', name='${page.name}', url='${page.url}', time='${page.time}'`,(err,result)=>
            {
                return callback(err);
            });
        },(err)=>
        {
            if(err) throw err;
            if(req.body.remove)
            {
                async.forEachOf(req.body.remove,(page,key,callback)=>
                {
                    console.log(req.body.remove,key);
                    mysql.connection.query(`DELETE FROM ${constants.getConstant("prefix")}_Vote WHERE name='${req.body.remove[key]}'`,(err,result)=>
                    {
                        callback(err);
                    })
                },(err)=>
                {
                    if(err) throw err;
                    res.send(JSON.stringify({success:true})); 
                });
            }
            else
            {
                res.send(JSON.stringify({success:true}));
            }
        });
});
router.post("/palette/add",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    let palette = req.body.palette;
    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_palettes (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES('${palette["name"]}','${palette["Main color"]}','${palette["Secondary main color"]}','${palette["Font color dark"]}','${palette["Font color light"]}','${palette["Fill Color"]}','0')`,(err,result)=>
    {
       if(err) return res.send(JSON.stringify({success:false})); 
       return res.send(JSON.stringify({success:true}));
    });
});
router.post("/palette/update",(req,res)=>
{
    console.log("wew");
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    let palette = req.body.palette;
    let name = req.body.name;
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_palettes SET active='0' WHERE active='1'`,(err,result)=>
    {
        if(err) throw err;
        mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_palettes (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES ('${name}','${palette.maiColor}','${palette.secondaryMainColor}','${palette.fontColorDark}','${palette.fontColorLight}','${palette.fillColor}','1')
        ON DUPLICATE KEY UPDATE mainColor='${palette.mainColor}',secondaryMainColor='${palette.secondaryMainColor}',fontColorDark='${palette.fontColorDark}',fontColorLight='${palette.fontColorLight}',fillColor='${palette.fillColor}',active='1'
        `,(err,result)=>
        {
            if(err) throw err;
            app.locals.palette = palette;
            return res.send(JSON.stringify({success:true}));
        });
    });
});
router.post("/changeImage",(req,res)=>
{
    
    fs.readdir('./public/images',(err,files)=>
    {
        if(err) throw err;
        files = files.filter((file)=>
        {
            let ending = file.split(".")[1];
            if(ending && (ending === "png" || ending === "jpg" || ending === "gif")) return file;
        });
        return res.send(JSON.stringify({success:true,files:files}));
    });
}); 
router.post("/heroImage/change",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_design SET heroImage='${req.body.file}' WHERE id='1'`,(err,result)=>
    {
        if(err) throw err;
        app.locals.heroImage = req.body.file;
        return res.send(JSON.stringify({success:true}));
    })
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
    mysql.connection.query(`SELECT name,nx,time,url FROM ${constants.getConstant("prefix")}_Vote`,(err,globalSettings)=>
    {
        if(err) throw err;
        mysql.connection.query(`SELECT * FROM ${constants.getConstant("prefix")}_palettes`,(err,palettes)=>
        {
        if(err) throw err;
        let activePalette = palettes[0];
        for(let i = 0; i < palettes.length; i++)
        {
            if(palettes[i].active == 1){
                activePalette = palettes[i];
                break;
            }
        }
        res.render("pages/dashboardGM",{votes:globalSettings,palettes:{all:palettes,active:activePalette}});
        });
    });
}
function renderDashboard(req,res)
{
    res.render("pages/dashboardUser");
}
module.exports = function(applet)
{
    app = applet;
    return router;
};