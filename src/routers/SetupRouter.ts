import express from "express";
import InstallationHandler, {InstallerI} from "../setup/InstallationHandler";
import mnHandler from "../setup/MNHandler";
import * as constants from "../core/Constants";
import DBConn from "../core/database/DatabaseConnection";
import {PalettesInterface, SettingsInterface} from "../core/Interfaces/DatabaseInterfaces";
import multer from "multer";
import app from '../app';
import Setup, {SetupFile} from "../models/Setup";
import {getConfig} from "../core/config/Config";
import md5 from "md5";
import IO from "../models/IO";
import Logger from "../core/logger/Logger";
import DatabaseConnection from "../core/database/DatabaseConnection";
const router = express.Router();
const setup = new Setup();
const io = new IO();
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
    return res.redirect("./complete");
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
    return res.redirect("./template");
});

//TEMPLATE
router.get("/template",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    return res.render("setup/setup_design",{name:settings.serverName});
});

router.post("/template",async (req,res)=>
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

//COMPLETE
router.get("/complete",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    await setup.complete();
    return res.render("setup/setup_complete",{name:settings.serverName});
});

//LOGIN WEBADMIN
router.get("/webadmin",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    let account = io.getAccount(req.session);
    if(account) {
        return res.redirect("./colors");
    }
    if(!mysql) return;
    let settings = constants.getConstant<SettingsInterface>("settings");
    return res.render("./setup/setup_login",{name:settings.serverName});
});

router.post("/webadmin",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql) return;

    //error prevention
    if(!req.body.form || (req.body.form !== "register" && req.body.form !== "login")) {
        return res.render("setup/error", {
            page: "webadmin",
            error: {reason: "Invalid post form"}});
    }

    if(req.body.form === "register") {
        if(req.body.password !== req.body.confirm_password) {
            return res.render("setup/error", {
                page: "webadmin",
                error: {reason: "Passwords does not match!"}});
        }
        let respons = await io.register(req.session,req.body.username,md5(req.body.password),new Date(),req.body.email);
        await DatabaseConnection.getInstance().updateAccount(respons.account.id,{webadmin:5});

    } else if(req.body.form === "login") {
        Logger.log("debug",[req.session,req.body.username,md5(req.body.password)] + "");
        let response = await io.login(req.session,req.body.username,md5(req.body.password));
        if(!response.REST.loggedin) {
            return res.render("setup/error", {
                page: "webadmin",
                error: {reason: response.REST.reason}});
        } else {
            await DatabaseConnection.getInstance().updateAccount(response.account.id,{webadmin:5});
        }
    }
    return res.redirect("./colors");
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
                            error: {reason: app.getDatabase().printError(err.errno)}});
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
                        return res.redirect("./webadmin");
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
            let config = await getConfig();
            let setupStatus = await setup.setupData();
            if(number != 1 && (!DBConn.isConnected() || config.server.database.prefix.length == 0)) {
                return res.redirect("1");
            }
            if(number == 1) {
                if(config.server.database.prefix.length > 0) {
                    return res.redirect("2");
                }
            }
            if(number == 2 && setupStatus.settingsComplete) {
                return res.redirect("webadmin");
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
