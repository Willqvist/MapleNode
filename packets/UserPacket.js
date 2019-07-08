const Packet = require('./Packet');
const mysql = require("../Tools/mysql").getMysql();
const Logger = require("../Logger/Logger");
class UserPacket extends Packet
{
    isLoggedIn()
    {
        return this.req.session.user;
    }
    getUser()
    {
        return this.req.session.user;
    }
    isAdmin()
    {
        return this.getUser().gm >= 1;
    }
    getUserCharacters()
    {
        if(!this.res.locals.userCharacters) return [];
        return this.res.locals.userCharacters;
    }
    onPageLoad(req,res,callback)
    {
        if(this.isLoggedIn())
        {
            mysql.connection.query(`SELECT * FROM characters WHERE accountid='${this.getUser().id}'`,(err,result)=>
            {
                if(err) Logger.error(err);
                res.locals.userCharacters = result;
                callback();
            })
        }
        else
        {
            callback();
        }
    }
}
module.exports = UserPacket;