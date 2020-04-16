import express from "express";
import InstallationHandler, {InstallerI} from "../setup/InstallationHandler";
import mnHandler from "../setup/MNHandler";
import * as constants from "../core/Constants";
import DBConn from "../core/database/DatabaseConnection";
import {PalettesInterface, SettingsInterface} from "../core/Interfaces/DatabaseInterfaces";
import multer from "multer";
import app from '../app';
import Setup, {SetupFile} from "../core/models/Setup";
const router = express.Router();
const setup = new Setup();
let upload = multer({dest:'upload/'});

router.all("*",async (req,res,next)=>
{
    let data;
    data = await setup.setupData();
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
    let logo : Express.Multer.File = req.files["logoUpload"][0];
    let hero : Express.Multer.File = req.files["heroUpload"][0];
    let logoDest : SetupFile = {fileName:logo.filename,mimetype:logo.mimetype,destName:"logo"};
    let heroDest : SetupFile = {fileName:hero.filename,mimetype:hero.mimetype,destName:"heroImage"};
    await setup.setDesign(logoDest,heroDest);
    return res.redirect("./palette");
});

//PALETTE
router.get("/colors",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    return res.render("setup/setup_color",{name:settings.serverName});
});

router.post("/colors",async (req,res)=>
{
    try {
        let result = await setup.addPalette(
            req.body.name,
            req.body.mainColor,
            req.body.secondaryMainColor,
            req.body.fillColor,
            req.body.fontColorDark,
            req.body.fontColorLight
        );
    }catch(err) {
        return res.render("setup/error", {
            page: "colors",
            error: {reason: err.message}});
    }
    return res.redirect("complete");
});

router.all(["/","index"], (req,res)=>
{
    console.log("here!!!");
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
                    data.prefix = prefix;
                    try {
                        await setup.connectToDatabase(data);
                        return res.redirect(number + 1 + "");
                    }catch(err) {
                        return res.render("setup/error", {
                            page: number,
                            error: {reason: app.getDatabase().printError(err)}});
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
                        await setup.settings(settings,req.body.downloadSetup,req.body.downloadClient);
                        app.getApp().locals.palette = constants.getConstant<PalettesInterface>("palette");
                        app.getApp().locals.heroImage = "headerImage.png";
                        app.getApp().locals.logo = "svgs/logo.svg";
                        return res.redirect("/setup/design");
                    }catch(err) {
                        return res.render("setup/error",{page:number,error:{reason:err.message}});
                    }
                break;
                default:
                    return res.render("error",{page:number,error:{reason:"something went wrong"}});
                break;
            }
        }
        else{
            let iObj = await setup.setupData();
            if(number != 1 && (!DBConn.isConnected() || !iObj.prefix)) {
                return res.redirect("1");
            }
            if(number == 1) {
                if(iObj.prefix && await mnHandler.isDatabaseSetup()) {
                    return res.redirect("2");
                }
            }
            if(number == 2 && iObj.settingsComplete) {
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

async function isAllowed(req,res) {
    let settings = await setup.setupData();
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
export default router;
