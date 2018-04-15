const fs = require("fs");
class MNHandler
{
    saveMysql(data,callback)
    {
        let string = JSON.stringify(data);
        fs.writeFile("settings/database.MN",string,(err)=>
        {
            console.log(err); 
            callback(err);  
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
}
module.exports = MNHandler;