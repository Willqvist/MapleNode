const express = require("express");
const router = express.Router();
const app = require("../app");
const mysql = require("mysql");
const InstallationHandler = require("../Tools/InstallationHandler");
const MNHandler = require("../Tools/MNHandler");

let mnHandler = new MNHandler();
let installHandler = new InstallationHandler(app.mysql);
router.all("/*",(req,res)=>
{
    let split = req.url.split("/").filter(n=> n !== '');
    let number = parseInt(split[0]);
    console.log(number);
    if(number)
    {
        if(number)
            console.log(number);
        if(req.method == "POST")
        {
            switch(number)
            {
                case 1:
                    let data = {};
                    data.user = req.body.user;
                    data.password = req.body.password;
                    data.host = req.body.host;
                    let prefix = req.body.prefix;
                    data.database = req.body.database;
                    console.log(app.mysql);
                    mysqlCon = mysql.createConnection(data);
                    mysqlCon.connect((err)=>
                    {
                        if(err)
                            return res.render("setup/error",{page:number,error:{reason:installHandler.getInstallErrors(err.code)}});
                        mnHandler.saveMysql(data,(err)=>
                        {
                            installHandler.setMysqlSetupComplete((err)=>
                            {
                                return res.redirect(number+1);    
                            });
                        });    
                    });
                break;
                case 2:
                    let dat = {};
                    installHandler.setSetupComplete(dat,(err)=>
                    {
                        return res.redirect("../"); 
                    });
                break;
                default:
                    return res.render("setup/error",{page:number,error:{reason:"something went wrong"}});  
                break;
            }
        }
        else{
            return res.render("setup/setup_"+number);
        }
    }
    else
    {
        return res.render("setup/index");
    }
});
module.exports = router;