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

router.all(["/","index"],(req,res)=>
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
                        await installHandler.setSetupComplete(settings,req.body.downloadSetup,req.body.downloadClient);
                        constants.setConstant("setup-status", 1);
                        app.locals.palette = constants.getConstant("palette");
                        app.locals.heroImage = "headerImage.png";
                        app.locals.logo = "svgs/logo.svg";
                        return res.redirect("/");
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
            if(number != 1 && !DBConn.isConnected()) {
                return res.redirect("1");
            }
            if(number == 1) {
                if(await mnHandler.isDatabaseSetup()) {
                    return res.redirect("2");
                }
            }
            return res.render("setup/setup_"+number);
        }
    }
    else
    {
        return res.redirect("/");
    }
});
export default function(applet)
{
    app = applet;
    return router;
};