const fs = require("fs");
class MNHandler
{
    saveMysql(data,callback)
    {
        let string = JSON.stringify(data);
        this.checkForFile("settings/database.MN",()=>
        {
            fs.writeFile("settings/database.MN",string,(err)=>
            {
                callback(err);  
            });
        });
    }
    isDatabaseSetup() 
    {
        return fs.existsSync("settings/database.MN");
    }
    getMysql()
    {
        return JSON.parse(fs.readFileSync("settings/database.MN","utf8"));
    }
    checkForFile(fileName,callback)
    {
        if (!fs.existsSync("settings")){
            fs.mkdirSync("settings");
        }
        fs.exists(fileName, function (exists) {
            if(exists)
            {
                callback();
            }else
            {
                fs.writeFile(fileName, {flag: 'wx'}, function (err, data) 
                { 
                    callback();
                })
            }
        });
    }
}
module.exports = new MNHandler();