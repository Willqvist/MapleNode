const express = require("express");
const router = express.Router();
const InstallationHandler = require("../Tools/InstallationHandler");
const mnHandler = require("../Tools/MNHandler");
const mysql = require("../Tools/mysql").getMysql();
const constants = require("../Tools/Constants");
let installHandler = new InstallationHandler(mysql.mysql);
router.all("/*",(req,res,next)=>
{
    installHandler.installationComplete((done,data)=>
    {
      if(done)
        return res.status(403).render('error/404',{errCode:403});
      return next();
    });
});
router.all("/:id/",(req,res,next)=>
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
                    mysql.setConnection(mysql.getHandler().createConnection(data));
                    mysql.connection.connect((err)=>
                    {
                        if(err) return res.render("setup/error",{page:number,error:{reason:installHandler.getInstallErrors(err.code)}});
                        mnHandler.saveMysql(data,(err)=>
                        {
                            data.prefix = prefix;
                            installHandler.setMysqlSetupComplete(data,(err)=>
                            {
                                return res.redirect(number+1);    
                            });
                        });    
                    });
                break;
                case 2:
                    installHandler.setSetupComplete(req.body,(err)=>
                    {
                        if(err) return res.redirect("setup/error",{page:number,error:{reason:installHandler.getInstallErrors(err.code)}});
                        return res.redirect("/"); 
                    });
                break;
                default:
                    return res.render("error",{page:number,error:{reason:"something went wrong"}});  
                break;
            }
        }
        else{
            if(number == 2 && mysql.connection.state === "disconnected") return res.redirect("1");
            return res.render("setup/setup_"+number);
        }
    }
    else
    {
        return res.redirect("/");
    }
});
router.all(["/","index"],(req,res)=>
{
    return res.render("setup/index");
});
module.exports = router;