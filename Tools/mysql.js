const mysql = require("mysql");
const mnHandler = require("./MNHandler");
class MySQL{
    constructor(mysql){
        this.mysql = mysql;
        this.mysqlCon = null;
        this.connection = {state:"disconnected"};
    }
    instantiate(callback)
    {
        if(mnHandler.isDatabaseSetup())
        {
            let data = mnHandler.getMysql();
            this.connection = this.mysql.createConnection(data);
            this.connection.connect((err)=>
            {
                callback(err);
            }); 
        }
        else
        {
            callback(true); 
        }
    }
    getConnection()
    {
        return this.mysqlCon;
    }
    getHandler()
    {
        return this.mysql;
    }
    setConnection(mysql)
    {
        this.connection = mysql;
    }
}
let mysqlObject = new MySQL(mysql);
function getMysql()
{
    return mysqlObject;
}
module.exports = 
{
    getMysql:getMysql
};