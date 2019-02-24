const mysql = require("./mysql").getMysql();
const mnHandler = require("./MNHandler");
const constants = require("../Tools/Constants");

const fs = require("fs");
const limit = 100;

class MapleLibrary
{
    constructor()
    {
        this.cache = {};
        this.mysql = mysql.connection;
        this.instantiated = false;
    }
    setMysql(mysql)
    {
        this.mysql = mysql.connection;
    }
    instantiate(callback)
    {
        let data = mnHandler.getMysql();
        this.mysql = this.mysql.createConnection(data);
        this.mysql.connect((err)=>
        {
            this.instantiated = true;
            callback(err);
        }); 
    }
    getByID(id,callback)
    {
        this.mysql.query(`SELECT * FROM library_v62 WHERE id ='${id}'`,(err,result)=>
        {
            if(err) return callback(err);
            return callback(result[0]);
        });
    }
    getDrops(id,callback)
    {
        if(this.cache[id]) return callback(this.cache[id]);
        this.mysql.query(`SELECT monsterid,itemid,chance FROM monsterdrops WHERE monsterid='${id}' AND chance >= 0 OR monsterid <= 0`,(err,result)=>
        {

            if(err) throw err;
            this.cache[id] = result;
            callback(result);
        });
    }
    getMonsters(item_id,callback)
    {
        if(this.cache[item_id]) return callback(this.cache[item_id]);
        this.mysql.query(`SELECT monsterid FROM monsterdrops WHERE itemid='${item_id}'`,(err,result)=>
        {

            if(err) throw err;
            this.cache[item_id] = result;
            callback(result);
        });
    }
    getMonstersDropping(item_id,callback)
    {
        this.getMonsters(item_id,(monsters)=>
        {

            let monster_index=0;
            let size = monsters.length;
            monsters.forEach(monster => {
                this.getDrops(monster.monsterid,(drops)=>
                {
                    monster_index++;
                    let minChance = 1;
                    drops.forEach(item => {
                        if(item.chance > minChance)
                            minChance = item.chance;
                    });
                    console.log("new:",minChance);
                    let perc = 0;
                    let lastAssigned = -1;
                    drops.forEach(item => {
                        item.start = lastAssigned +1;
                        item.chance_percent = (1/item.chance)*minChance;
                        perc += item.chance_percent;
                        item.chance_percent = Math.min(100,parseFloat((1-Math.pow((minChance-item.chance_percent)/minChance,2*constants.getConstant("settings").dropRate))*100).toFixed(2));
                        //item.chance_percent = parseFloat((1-Math.pow((minChance-Math.ceil((minChance/item.chance)))/minChance,4))*100).toFixed(3);
                        //console.log(item.chance_percent);
                        lastAssigned += item.chance_percent;
                    });
                    //console.log(perc,lastAssigned);
                    monster.items = drops;
                    monster.items.meso =
                        {
                            itemid:90000000,
                            chance_percent:parseFloat((1-Math.pow(perc/minChance,4))*100).toFixed(2)
                        };
                    if(size<=monster_index)
                    {
                        callback(monsters);
                    }
                })
            });
        })
    }
    getMeta(id,type,callback)
    {
        this.getMonstersDropping(id,(monsters)=>
        {
            //console.log(monsters);
            type = constants.getConstant("type_mapper")[type];
            let path = "/library/v62/"+type+"/"+id+"/meta.json";
            let root = constants.getConstant("realPath");
            fs.readFile(root + path,'utf8',(err,data)=>
            {
                if(err) return callback({name:"undefined",desc:"undefined"});
                data = JSON.parse(data);
                data.type=type;
                data.drops = monsters;
                return callback(data);
            });
        });
    }
    getData(dat,callback)
    {
        if(!dat.type)
            this.getByID(dat.id,(result)=>
            {
                this.getMeta(dat.id,result.type,callback);
            });
        else
            this.getMeta(dat.id,dat.type,callback);
    }
    getMobs(keyword,callback)
    {
        this.mysql.query(`SELECT * FROM library_v62 WHERE name LIKE '%${keyword}%' AND type='Mob' LIMIT ${limit}`,(err,result)=>
        {
            
            if(err) return callback(err);
            return callback(result);
        });
    }
    getAll(keyword,callback)
    {
        this.mysql.query(`SELECT * FROM library_v62 WHERE name LIKE '%${keyword}%' LIMIT ${limit}`,(err,result)=>
        {
            if(err) return callback(err);
            return callback(result);
        });
    }
}
const library = new MapleLibrary(mysql);
function getLibrary()
{
    return library;
}
module.exports = 
{
    getLibrary:getLibrary
};