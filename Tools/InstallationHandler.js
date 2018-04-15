const fs = require("fs");
const async = require("async");
class InstallationHandler
{
    constructor(mysql)
    {
        this.mysql = mysql;
    }
    installationComplete(callback)
    {
        fs.exists("settings/setup.MN",(exists)=>
        {
            let data =
            {
                done:false,
                mysqlSetupComplete:false,
            }
            if(exists)
            {
                fs.readFile("settings/setup.MN","utf8",(err, text)=>
                {
                    let data = JSON.parse(text);
                    callback(data.done,data);
                });
            }
            else
            {
                callback(data.done,data);
            }
        });
    }
    setMysqlSetupComplete(callback)
    {
        this.getInstallerObject((data)=>
        {
            data.mysqlSetupComplete = true; 
            this.saveInstallerObject(data,(err)=>
            {
                callback(err);
            });
        });
    }
    setSetupComplete(info,callback)
    {
        console.log("MYSQL",this.mysql);
        this.getInstallerObject((data)=>
        {
            data.done=true; 
            this.saveInstallerObject(data,(err)=>
            {
                callback(err);
            });
        });
    }
    saveInstallerObject(data,callback)
    {
        fs.writeFile("settings/setup.MN",JSON.stringify(data),(err)=>
        {
            callback(err);
        });
    }
    getInstallerObject(callback)
    {
      this.installationComplete((done,data)=>
      {
        callback(data);   
      });  
    }
    getInstallErrors(error)
    {
        switch(error)
        {
            case "ECONNREFUSED":
                return "connection refused.. is mysql on?";
            break;
            case "ENOTFOUND":
                return "Could not connect to host";
            break;
            case "ER_ACCESS_DENIED_ERROR":
                return "Wrong username or password";
            break;
            case "ER_BAD_DB_ERROR":
                return "Could not find database";
            break;
            default:
                return "something went wrong... error code: " + error;
            break;
        }
    }
}
module.exports = InstallationHandler;