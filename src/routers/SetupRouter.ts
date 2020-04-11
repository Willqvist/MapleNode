import express from "express";
import InstallationHandler from "../src/tools/InstallationHandler";
import mnHandler from "../src/tools/MNHandler";
import * as constants from "../src/tools/Constants";
import DBConn from "../src/database/DatabaseConnection";
import * as startup from "../startup";
import { SettingsInterface } from "../src/database/DatabaseInterfaces";

const router = express.Router();
let app;
let installHandler = new InstallationHandler();
const settingsSrc = "/settings/setup.MN"


router.all("*",async (req,res,next)=>
{
    let data;
    data = await installHandler.installationComplete(settingsSrc);
    if(data.done)
        return res.status(403).send('403 - access denied');
    return next();
});

router.all("/logo",async (req,res)=>
{
    console.log("logo");
    return res.render("setup/setup_logo");
});

router.all(["/","index"],async (req,res)=>
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
                        console.log(err);
                        return res.render("setup/error", {
                            page: number,
                            error: {reason: installHandler.getInstallErrors(err.errno)}});
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
                        app.locals.palette = constants.getConstant("palette");
                        app.locals.heroImage = "headerImage.png";
                        app.locals.logo = "svgs/logo.svg";
                        return res.redirect("/setup/logo");
                    }catch(err) {
                        return res.redirect(301,"setup/error",{page:number,error:{reason:installHandler.getInstallErrors(err.code)}});
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
                return res.redirect("logo");
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

export default function(applet)
{
    app = applet;
    return router;
};