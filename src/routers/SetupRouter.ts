import express from "express";
import * as constants from "../core/Constants";
import DBConn from "../core/database/DatabaseConnection";
import {PalettesInterface, SettingsInterface} from "../core/Interfaces/DatabaseInterfaces";
import multer from "multer";
import app from '../app';
import Setup, {SetupFile} from "../models/Setup";
import {getConfig} from "../core/config/Config";
import md5 from "md5";
import IO from "../models/IO";
import DatabaseConnection from "../core/database/DatabaseConnection";
import {DatabaseAuthInterface} from "../core/Interfaces/Interfaces";

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
        const {name, mainColor, secondaryMainColor, fillColor, fontColorDark, fontColorLight } = req.body;
        let result = await setup.addPalette(
            name,
            mainColor,
            secondaryMainColor,
            fillColor,
            fontColorDark,
            fontColorLight
        );
    }catch(err) {
        const { message } = err.message;
        return res.render("setup/error", {
            page: "colors",
            error: {reason: message}});
    }
    return res.redirect("./template");
});

//TEMPLATE
router.get("/template",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");

    const { serverName } = settings;
    return res.render("setup/setup_design",{name: serverName});
});

router.post("/template",async (req,res)=>
{
    //TODO: implemented code...
});

//COMPLETE
router.get("/complete",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql || !sett) return;
    let settings = constants.getConstant<SettingsInterface>("settings");

    const { serverName } = settings;
    await setup.complete();
    return res.render("setup/setup_complete",{name:serverName});
});

//LOGIN WEBADMIN
router.get("/webadmin",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);

    const { session } = req.session;
    let account = io.getAccount(session);
    if(account) {
        return res.redirect("./colors");
    }
    if(!mysql) return;
    let settings = constants.getConstant<SettingsInterface>("settings");

    const { serverName } = settings;
    return res.render("./setup/setup_login",{name:serverName});
});

router.post("/webadmin",async (req,res)=>
{
    let [mysql,sett] = await isAllowed(req,res);
    if(!mysql) return;

    const { form, password, confirm_password, username, email } = this.body;

    //error prevention
    if(!form || (form !== "register" && form !== "login")) {
        return res.render("setup/error", {
            page: "webadmin",
            error: {reason: "Invalid post form"}});
    }

    if(form === "register") {
        if(password !== confirm_password) {
            return res.render("setup/error", {
                page: "webadmin",
                error: {reason: "Passwords does not match!"}});
        }
        let { account } = await io.register(req.session,username,md5(password),new Date(),email);
        await DatabaseConnection.getInstance().updateAccount(account.id,{ webadmin: 5 });

    } else if(form === "login") {
        const { REST, account } = await io.login(req.session,username,md5(password));
        const { loggedin, reason } = REST;
        if(!loggedin) {
            return res.render("setup/error", {
                page: "webadmin",
                error: {reason: reason}});
        } else {
            await DatabaseConnection.getInstance().updateAccount(account.id,{ webadmin: 5 });
        }
    }
    return res.redirect("./colors");
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
                    const { prefix, user, password, host, database } = req.body;
                    let auth : DatabaseAuthInterface & {prefix: number} = {
                        user,
                        host,
                        database,
                        password,
                        prefix
                    };
                    try {
                        await setup.connectToDatabase(auth);
                        return res.redirect(number + 1 + "");
                    }catch({ errno }) {

                        return res.render("setup/error", {
                            page: number,
                            error: {reason: app.getDatabase().printError(errno)}});
                    }
                break;
                case 2:
                    try {
                        const { version, exp, vp, serverName, drop, meso, nx, gmLevel, downloadSetup, downloadClient } = req.body;
                        let settings : SettingsInterface = {
                            version,
                            gmLevel,
                            serverName,
                            expRate: exp,
                            vpColumn: vp,
                            dropRate: drop,
                            mesoRate : meso,
                            nxColumn: nx,
                        }
                        await setup.settings(settings,downloadSetup,downloadClient);
                        app.getApp().locals.palette = constants.getConstant<PalettesInterface>("palette");
                        app.getApp().locals.heroImage = "headerImage.png";
                        app.getApp().locals.logo = "svgs/logo.svg";
                        return res.redirect("./webadmin");
                    }catch({ message }) {
                        return res.render("setup/error",{page:number,error:{reason:message}});
                    }
                break;
                default:
                    return res.render("error",{page:number,error:{reason:"something went wrong"}});
                break;
            }
        }
        else{
            const { server } = await getConfig();
            const { settingsComplete } = await setup.setupData();
            if(number != 1 && (!DBConn.isConnected() || server.database.prefix.length == 0)) {
                return res.redirect("1");
            }
            if(number == 1) {
                if(server.database.prefix.length > 0) {
                    return res.redirect("2");
                }
            }
            if(number == 2 && settingsComplete) {
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
    const { mysqlSetupComplete, settingsComplete } = await setup.setupData();
    if(!mysqlSetupComplete) {
        res.redirect("1");
        return [true,false];
    }
    if(!settingsComplete) {
        res.redirect("2");
        return [false,true];
    }
    return [true,true];
}
export default router;
