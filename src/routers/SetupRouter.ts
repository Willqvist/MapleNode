import express from "express";
import InstallationHandler, {InstallerI} from "../src/tools/InstallationHandler";
import mnHandler from "../src/tools/MNHandler";
import * as constants from "../src/tools/Constants";
import DBConn from "../src/database/DatabaseConnection";
import * as startup from "../startup";
import {PalettesInterface, SettingsInterface} from "../src/database/DatabaseInterfaces";
import multer from "multer";
import fs from "fs";
import FileTools from "../tools/FileTools";
import mime from 'mime-types';
const router = express.Router();
let app;
let installHandler = new InstallationHandler();
const settingsSrc = "/settings/setup.MN"
let upload = multer({dest:'upload/'});

router.all("*",async (req,res,next)=>
{
    let data;
    data = await installHandler.installationComplete(settingsSrc);
    if(data.done)
        return res.status(403).send('403 - access denied');
    return next();
});

//DESIGN
router.get("/design",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    return res.render("setup/setup_logo",{name:settings.serverName});
});

router.post("/design",upload.fields([{name:'logoUpload',maxCount:1},{name:'heroUpload',maxCount:1}]),async (req,res,next)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let logo = req.files.logoUpload;
    let hero = req.files.heroUpload;
    let move = async (file,name)=>{
        if(!file || file.length == 0) return;
        file = file[0];
        let ext = mime.extension(file.mimetype);
        let success = await FileTools.move(`upload/${file.filename}`,`public/upload/${name}.${ext}`);
    };

    await move(logo,"logo");
    await move(hero,"heroImage");

    return res.redirect("./design");
});

//PALETTE
router.get("/palette",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    return res.render("setup/setup_color",{name:settings.serverName});
});

router.all(["/","index"], (req,res)=>
{
    return res.render("setup/index");
});

router.all("/:id/",async (req,res,next)=>
{
    let number = parseInt(req.params.id);
    if(!number || number > 2) return next();
    if(number)
    {
        if(req.method == "POST")
        {
            switch(number)
            {
                case 1:
                    let data : any = {};
                    let prefix = req.body.prefix;
                    data.user = req.body.user;
                    data.password = req.body.password;
                    data.host = req.body.host;
                    data.database = req.body.database;
                    try {
                        let status = await DBConn.createInstance(startup.getDatabase(), data);
                        let mysqlRes = await mnHandler.saveMysql(data);
                        data.prefix = prefix;
                        let err = await installHandler.setMysqlSetupComplete(data);
                        return res.redirect(number + 1);
                    }catch(err) {
                        return res.render("setup/error", {
                            page: number,
                            error: {reason: installHandler.getInstallErrors(err)}});
                    }
                break;
                case 2:
                    try {
                        let settings : SettingsInterface = {
                            version: req.body.version,
                            expRate: req.body.exp,
                            vpColumn: req.body.vp,
                            serverName : req.body.serverName,
                            dropRate: req.body.drop,
                            mesoRate : req.body.meso,
                            nxColumn: req.body.nx,
                            gmLevel: req.body.gmLevel
                        }
                        await installHandler.saveSettings(settings,req.body.downloadSetup,req.body.downloadClient,settingsSrc);
                        constants.setConstant("setup-status", 1);
                        constants.setConstant("settings", settings);
                        app.locals.palette = constants.getConstant<PalettesInterface>("palette");
                        app.locals.heroImage = "headerImage.png";
                        app.locals.logo = "svgs/logo.svg";
                        return res.redirect("/setup/design");
                    }catch(err) {
                        return res.redirect(301,"setup/error",{page:number,error:{reason:installHandler.getInstallErrors(err)}});
                    }
                break;
                default:
                    return res.render("error",{page:number,error:{reason:"something went wrong"}});  
                break;
            }
        }
        else{
            let iObj = await installHandler.getInstallerObject(settingsSrc);
            console.log(iObj);
            if(number != 1 && (!DBConn.isConnected() || !iObj.prefix)) {
                return res.redirect("1");
            }
            if(number == 1) {
                if(iObj.prefix && await mnHandler.isDatabaseSetup()) {
                    return res.redirect("2");
                }
            }
            if(number == 2 && iObj.settingsComplete) {
                console.log("here!");
                return res.redirect("design");
            }
            return res.render("setup/setup_"+number);
        }
    }
    else
    {
        return res.redirect("/");
    }
});

async function hasFinishedSetup() : Promise<boolean> {
    let iObj = await installHandler.getInstallerObject(settingsSrc);
    return iObj.done;
}

async function isAllowed(req,res) {
    let settings = await installHandler.getInstallerObject(settingsSrc);
    if(!settings.mysqlSetupComplete) {
        res.redirect("1");
        return [true,false];
    }
    if(!settings.settingsComplete) {
        res.redirect("2");
        return [false,true];
    }
    return [true,true];
}

export default function(applet)
{
    app = applet;
    return router;
};