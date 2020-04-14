const express = require("express");
const router = express.Router();
const mysql = require("../core/tools/mysql").getMysql();
const constants = require("../core/Constants");
const fs = require("fs");
const Logger = require("../core/logger/Logger");
const CSSGenerator = require("../scripts/CSSGenerator/CSSGenerator");
let app;
router.get("/",(req,res)=>
{
    if(!isLoggedIn(req)) return res.render("pages/dashboardLogin");
    let user = getUser(req);
    if(user.gm == 0)
        return renderDashboard(req,res);
    else if(user.gm >= 1)
        return renderGMDashboard(req,res);
});
router.post("/vote/update",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_vote SET name = '${req.body.name}',url='${req.body.url}',nx='${req.body.nx}',time='${req.body.time}' WHERE id='${req.body.key}'`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true}));
    });
});

router.post("/vote/add",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    if(!req.body.name || !req.body.nx || !req.body.time || req.body.name.length == 0 || req.body.url.length == 0 || req.body.nx.length == 0 || req.body.time.length == 0) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));
    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_vote (name,url,nx,time) VALUES ('${req.body.name}','${req.body.url}','${req.body.nx}','${req.body.time}')`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true,id:result.insertId}));
    });
});

router.post("/vote/remove",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    mysql.connection.query(`DELETE FROM ${constants.getConstant("prefix")}_vote WHERE id = '${req.body.id}'`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true}));
    });
});

router.post("/palette/add",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    let palette = req.body;
    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_palettes (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES('${palette.name}','${palette.mainColor}','${palette.secondaryMainColor}','${palette.fontColorDark}','${palette.fontColorLight}','${palette.fillColor}','0')`,(err,result)=>
    {
       if(err) return res.send(JSON.stringify({success:false}));
       return res.send(JSON.stringify({success:true,key:result.insertId}));
    });
});
router.post("/palette/select",(req,res)=>
{
    console.log(req.body.key);
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_palettes SET active='0' WHERE active='1'`,(err,result)=>
    {
        mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_palettes SET active='1' WHERE ID='${req.body.key}'`,(err,result)=>
        {
            if(err) throw err;
            mysql.connection.query(`SELECT * FROM ${constants.getConstant("prefix")}_palettes WHERE ID='${req.body.key}'`,(err,resp)=>
            {
                let palette = resp[0];
                CSSGenerator.generateCSS(palette.mainColor,palette.secondaryMainColor,palette.fontColorDark,palette.fontColorLight,palette.fillColor,()=>
                {
                    console.log(palette);
                    return res.send(JSON.stringify({success:true}));
                });
            });
        });
    });
});
router.post("/palette/remove",(req,res)=>
{
    mysql.connection.query(`DELETE FROM ${constants.getConstant("prefix")}_palettes WHERE ID='${req.body.key}'`,(err,result)=>
    {
        if(err) throw err;
        return res.send(JSON.stringify({success:true}));
    });
});
router.post("/palette/update",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    let palette = req.body;
    let name = req.body.name;
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_palettes SET name='${name}',mainColor='${palette.mainColor}',secondaryMainColor='${palette.secondaryMainColor}',fontColorDark='${palette.fontColorDark}',fontColorLight='${palette.fontColorLight}',fillColor='${palette.fillColor}' WHERE ID='${req.body.key}'`,(err,result)=>
    {
        if(err) throw err;
        app.locals.palette = palette;
        CSSGenerator.generateCSS(palette.mainColor,palette.secondaryMainColor,palette.fontColorDark,palette.fontColorLight,palette.fillColor,()=>
        {
            return res.send(JSON.stringify({success:true}));
        });
    });
});
router.post("/changeImage",(req,res)=>
{

    readImages((files)=>
    {
        return res.send(JSON.stringify({success:true,files:files}));
    });
});
function readImages(callback,dir='./public/images/',start="",images=[])
{
    fs.readdir(dir+start,(err,files)=>
    {
        if(err) throw err;
        files.iterate((file,next)=>
        {
            if(fs.lstatSync('./public/images/'+start+"/"+file).isDirectory())
            {
                readImages((imgs)=>
                {
                    images = images.concat(imgs);
                    next();
                },dir,start+"/"+file);
            }
            else
            {
                let ending = file.split(".")[1];
                if(ending && (ending === "png" || ending === "jpg" || ending === "gif" || ending === "svg"))
                    images.push((start+"/"+file).substr(1));
                next();
            }
        },()=>
        {
            callback(images);
        });
    });
}
Array.prototype.iterate = function(callback,done,index=0)
{
    if(index==this.length) return done();
    if(this.length == 0) return;
    callback(this[index],()=>
    {
        this.iterate(callback,done,index+1);
    });
};
function readDir(dir,callback)
{
    fs.readdir(dir,(err,files)=>{if(err) throw err; callback(files);});
}
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
router.post("/logo/change",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_design SET logo='${req.body.file}' WHERE id='1'`,(err,result)=>
    {
        if(err) throw err;
        app.locals.logo = req.body.file;
        return res.send(JSON.stringify({success:true}));
    })
});
router.post("/download/update",(req,res)=>
{
    console.log(req.body);
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    console.log(req.body.name.length == 0);
    if(!req.body.name || !req.body.url || (req.body.name.length == 0 || req.body.url.length == 0)) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));

    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_downloads SET name = '${req.body.name}',url='${req.body.url}' WHERE id='${req.body.key}'`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true}));
    });
});
router.post("/download/remove",(req,res)=>
{
    console.log(req.body);
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    if(!req.body.id) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));
    mysql.connection.query(`DELETE FROM ${constants.getConstant("prefix")}_downloads WHERE id='${req.body.id}'`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true}));
    });

});

router.post("/download/add",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    if(!req.body.url || !req.body.name || req.body.name.length == 0 || req.body.url.length == 0) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));
    mysql.connection.query(`INSERT INTO ${constants.getConstant("prefix")}_downloads (name,url) VALUES ('${req.body.name}','${req.body.url}')`,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({success:true,id:result.insertId}));
    });
});

router.get("/layout/:name",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    if(req.params.name.length == 0) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));

    mysql.connection.query(`SELECT json FROM ${constants.getConstant("prefix")}_layout WHERE name = '${req.params.name}'`,(err,result)=>
    {
        if(err)
        {
            Logger.error(err);
            res.send(JSON.stringify({success:false,json:JSON.stringify({error:err})}));
        }
        fs.readdir("./views/panels/",(err,files)=>
        {
            if(err) Logger.error(err);
            res.send(JSON.stringify({success:true,json:result[0],content:files}));
        });
    });
});
router.post("/layout",(req,res)=>
{
    if(!isLoggedIn(req) || !isAdmin(req)) return res.status(403).send(JSON.stringify({success:false,reason:"access denied"}));
    if(req.body.json.length == 0 || req.body.name.length == 0) return res.status(406).send(JSON.stringify({success:false,reason:"Input may not be empty!"}));

    mysql.connection.query(`UPDATE ${constants.getConstant("prefix")}_layout SET json='${req.body.json}' WHERE name = '${req.body.name}'`,(err,result)=>
    {
        if(err)
        {
            Logger.error(err);
            return res.send(JSON.stringify({success:false,json:JSON.stringify({error:err})}));
        }
        CSSGenerator.generateHomeLayout(JSON.parse(req.body.json));
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
    mysql.connection.query(`SELECT name,nx,time,url,ID FROM ${constants.getConstant("prefix")}_Vote`,(err,globalSettings)=>
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
            mysql.connection.query(`SELECT * FROM ${constants.getConstant("prefix")}_downloads`,(err,downloads)=>
            {
                res.render("pages/dashboardGM",{votes:globalSettings,downloads:downloads,palettes:{all:palettes,active:activePalette},user:req.session.user});
            });
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
