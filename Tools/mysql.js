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
            callback(false); 
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
    connect(data,callback)
    {
        this.connection = this.mysql.createConnection(data);
        this.connection.connect((err)=>
        {
            callback(err);
        }); 
    }
    setConnection(mysql)
    {
        this.connection = mysql;
    }
}
let mysqlObject = new MySQL(mysql);
let connections = {};
function getMysql()
{
    return mysqlObject;
}
function createMysqlConnection(str)
{
    connections[str] = new MySQL(mysql);
    return connections[str];
}
function getMysqlConnetion(str)
{
    if(!connections[str])
        return undefined;
    
    return connections[str];
}
module.exports = 
{
    getMysql:getMysql,
    create:createMysqlConnection,
    getMysqlConnetion:getMysqlConnetion
};