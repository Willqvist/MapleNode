const express = require("express");
const router = express.Router();
const InstallationHandler = require("../src/tools/InstallationHandler");
const mnHandler = require("../src/tools/MNHandler");
let installHandler = new InstallationHandler();
const constants = require("../src/tools/Constants");
const DBConn = require("../src/database/DatabaseConnection");
const startup = require("../src/startup");
let app;
router.all("*",async (req,res,next)=>
{
    let data = await installHandler.installationComplete();
    console.log("IM HERE: ",data);
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
                    let data = {};
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
                            error: {reason: installHandler.getInstallErrors(err.code)}});
                    }
                break;
                case 2:
                    try {
                        let res = await installHandler.setSetupComplete(req.body);
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
module.exports = function(applet)
{
    app = applet;
    return router;
};