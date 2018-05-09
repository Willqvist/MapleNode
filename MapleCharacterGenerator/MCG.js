const ItemBuilder = require("./ItemBuilder");
const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
class MapleCharacterGenerator
{   
    constructor(mysql,cooldown)
    {
        this.cooldown = cooldown*0;
        this.players = [];
        this.parts = {};
        this.que = [];
        this.error =
        {
            INVALID_PLAYER:0,
            CANT_FIND_ITEM:1
        }
    }
    getPlayerFromName(name)
    {
        for(let i = 0; i < this.players.length; i++)
        {
            if(this.players[i].name === name)
                return this.players[i];
        }
        return null;
    }
    addToQueue(player)
    {
            
        this.que.push(player);
        if(this.que.length == 1)
            this.buildPlayer(player);
    }
    goToNextInQueue()
    {
        this.removeFromQueue(0);
        if(this.que.length == 0) return;
        this.buildPlayer(this.que[0]);
    }
    removeFromQueue(index)
    {
        this.que.splice(index,1);
    }
    generatePlayer(mysql,name,callback)
    {
        let player = {parts:{},name:name,callback:callback}
        let parts = player.parts;
        if(fs.existsSync(__dirname + "/Characters/"+name+".png"))
        {
            let stat = fs.statSync(__dirname + "/Characters/"+name+".png");
            let date = new Date(util.inspect(stat.mtime));
            let dateNow = new Date();
            if((dateNow-date)/1000 <  this.cooldown)
                return callback({success:true});
        }
        this.builder = new ItemBuilder();
        mysql.query("SELECT id, face, hair,skincolor FROM characters WHERE name=?",[name],((err,results)=>
        {   
            if(err) throw err;
            if(results.length == 0)
                return callback({success:false,errorID:this.error.INVALID_PLAYER,reason:"cant find player: " + name});
            player.parts.face = results[0].face;
            player.parts.hair = results[0].hair;
            player.parts.skincolor = results[0].skincolor;
            mysql.query("SELECT inventoryitems.itemid, inventoryitems.position FROM inventoryequipment INNER JOIN inventoryitems ON inventoryequipment.inventoryitemid = inventoryitems.inventoryitemid WHERE inventoryitems.characterid = ? AND inventoryitems.inventorytype = '-1'",[results[0].id],((err,results)=>
            {   
                if(err) throw err;  
                player.items = results;
                this.addToQueue(player);
            }).bind(player));
        }).bind(player));
    }
    buildPlayer(player)
    {
        this.builder.parts = player.parts;
        let results = player.items;
        for(let i = 0; i < results.length; i++)
        {
            switch(results[i].position) {
                case -1: case -101:player.parts.cap    = results[i].itemid;break;
                case -2: case -102:player.parts.mask   = results[i].itemid;break;
                case -3: case -103:player.parts.eyes   = results[i].itemid;break;
                case -4: case -104:player.parts.ears   = results[i].itemid;break;
                case -5: case -105:player.parts.coat   = results[i].itemid;break;
                case -6: case -106:player.parts.pants  = results[i].itemid;break;
                case -7: case -107:player.parts.shoes  = results[i].itemid;break;
                case -8: case -108:player.parts.glove  = results[i].itemid;break;
                case -9: case -109:player.parts.cape   = results[i].itemid;break;
                case -10:case -110:player.parts.shield = results[i].itemid;break;
                case -11:case -111:
                {
                    player.parts.weapon = results[i].itemid;
                    if(player.parts.weapon < 1700000)
                        this.builder.setWeaponInfo(player.parts.weapon);
                    else
                        player.parts.stand = 1;
                }break;
            }
        }
        if(player.parts.coat == null)
            player.parts.coat = 1040006;
        //1062051
        //1060002
        console.log("START BUILDING");
        this.builder.equipItems(player,
            [
                {method:this.builder.setCape,parameters:{id:player.parts.cape,z:"capeBelowBody"}},
                {method:this.builder.setShield,parameters:{id:player.parts.shield,z:"shield"}},
                {method:this.builder.setCap,parameters:{id:player.parts.cap,z:"capAccessoryBelowBody"}},
                {method:this.builder.setTorso,parameters:{id:player.parts.skincolor+2000,z:"skincolor"}},
                {method:this.builder.setCoat,parameters:{id:player.parts.coat,z:"mailChestBelowPants"}},
                {method:this.builder.setLongCoat,parameters:{id:player.parts.coat,z:"mailChestBelowPants"}},
                {method:this.builder.setPants,parameters:{id:player.parts.pants,z:"pantsBelowShoes"}},
                {method:this.builder.setShoes,parameters:{id:player.parts.shoes,z:"shoes"}},
                {method:this.builder.setPants,parameters:{id:player.parts.pants,z:"pants"}},
                {method:this.builder.setShoes,parameters:{id:player.parts.shoes,z:"shoesOverPants"}},
                {method:this.builder.setLongCoat,parameters:{id:player.parts.coat,z:"mailChestOverPants"}},                        
                {method:this.builder.setCoat,parameters:{id:player.parts.coat,z:"mailChest"}},
                {method:this.builder.setLongCoat,parameters:{id:player.parts.coat,z:"mailChest"}},
                {method:this.builder.setLongCoat,parameters:{id:player.parts.coat,z:"mailChestOverHighest"}},
                {method:this.builder.setHead,parameters:{id:player.parts.skincolor+2000,z:"skincolor"}},
                {method:this.builder.setAccessory,parameters:{id:player.parts.ears,z:"accessoryEar"}},
                {method:this.builder.setAccessory,parameters:{id:player.parts.mask,z:"accessoryFaceBelowFace"}},
                {method:this.builder.setFace,parameters:{id:player.parts.face,z:"face"}},
                {method:this.builder.setAccessory,parameters:{id:player.parts.mask,z:"accessoryFace"}},
                {method:this.builder.setAccessory,parameters:{id:player.parts.eyes,z:"accessoryEye"}},
                {method:this.builder.setHair,parameters:{id:player.parts.hair,z:"hairShade"}},
                {method:this.builder.setHair,parameters:{id:player.parts.hair,z:"hair"}},
                {method:this.builder.setHair,parameters:{id:player.parts.hair,z:"hairOverHead"}},
                {method:this.builder.setCap,parameters:{id:player.parts.cap,z:"cap"}},
                {method:this.builder.setGloves,parameters:{id:player.parts.glove,z:"gloveOverBody"}},
                {method:this.builder.setWeapon,parameters:{id:player.parts.weapon,z:"weapon"}},
                {method:this.builder.setArm,parameters:{id:player.parts.skincolor+2000}},
                {method:this.builder.setCoat,parameters:{id:player.parts.coat,z:"mailArm"}},
                {method:this.builder.setLongCoat,parameters:{id:player.parts.coat,z:"mailArm"}},
                {method:this.builder.setWeapon,parameters:{id:player.parts.weapon,z:"weaponOverArm"}},
                {method:this.builder.setHands,parameters:{id:player.parts.skincolor+2000}},
                {method:this.builder.setGloves,parameters:{id:player.parts.glove,z:"glove"}},
                {method:this.builder.setGloves,parameters:{id:player.parts.glove,z:"gloveOverHair"}},
            ],
            (player)=>
            {
                this.builder.outputImage(this.builder.canvas,__dirname + "/Characters/"+player.name+".png",()=>
                {
                    player.callback({success:true});
                    this.goToNextInQueue();
                });
            }
        );
    }
}
module.exports = MapleCharacterGenerator; 