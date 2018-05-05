const ItemBuilder = require("./ItemBuilder");
const mysql = require("mysql");
const util = require("util");
const fs = require("fs");
class MapleCharacterGenerator
{   
    constructor(mysql,cooldown)
    {
        this.cooldown = cooldown;
        this.parts = {};
        this.error =
        {
            INVALID_PLAYER:0,
            CANT_FIND_ITEM:1
        }
    }
    generatePlayer(mysql,name,callback)
    {
        this.parts = {}; 
        if(fs.existsSync(__dirname + "/Characters/"+name+".png"))
        {
            let stat = fs.statSync(__dirname + "/Characters/"+name+".png");
            let date = new Date(util.inspect(stat.mtime));
            let dateNow = new Date();
            if((dateNow-date)/1000 <  this.cooldown)
                return callback({success:true});
        }
        this.builder = new ItemBuilder();
        this.builder.parts = this.parts;
        mysql.query("SELECT id, face, hair,skincolor FROM characters WHERE name=?",[name],(err,results)=>
        {
            if(err) throw err;
            if(results.length == 0)
                return callback({success:false,errorID:this.error.INVALID_PLAYER,reason:"cant find player: " + name});
            this.parts.face = results[0].face;
            this.parts.hair = results[0].hair;
            this.parts.skincolor = results[0].skincolor;
            mysql.query("SELECT inventoryitems.itemid, inventoryitems.position FROM inventoryequipment INNER JOIN inventoryitems ON inventoryequipment.inventoryitemid = inventoryitems.inventoryitemid WHERE inventoryitems.characterid = ? AND inventoryitems.inventorytype = '-1'",[results[0].id],(err,results)=>
            {      
  
                if(err) throw err;
                for(let i = 0; i < results.length; i++)
                {
                    switch(results[i].position) {
                        case -1: case -101:this.parts.cap    = results[i].itemid;break;
                        case -2: case -102:this.parts.mask   = results[i].itemid;break;
                        case -3: case -103:this.parts.eyes   = results[i].itemid;break;
                        case -4: case -104:this.parts.ears   = results[i].itemid;break;
                        case -5: case -105:this.parts.coat   = results[i].itemid;break;
                        case -6: case -106:this.parts.pants  = results[i].itemid;break;
                        case -7: case -107:this.parts.shoes  = results[i].itemid;break;
                        case -8: case -108:this.parts.glove  = results[i].itemid;break;
                        case -9: case -109:this.parts.cape   = results[i].itemid;break;
                        case -10:case -110:this.parts.shield = results[i].itemid;break;
                        case -11:case -111:
                        {
                            this.parts.weapon = results[i].itemid;
                            if(this.parts.weapon < 1700000)
                                this.builder.setWeaponInfo(this.parts.weapon);
                            else
                                this.parts.stand = 1;
                        }break;
                    }
                }
                if(this.parts.coat == null)
                    this.parts.coat = 1040006;
                //1062051
                //1060002
                console.log(this.parts);
                this.builder.equipItems(
                    [
                        {method:this.builder.setCape,parameters:{id:this.parts.cape,z:"capeBelowBody"}},
                        {method:this.builder.setShield,parameters:{id:this.parts.shield,z:"shield"}},
                        {method:this.builder.setCap,parameters:{id:this.parts.cap,z:"capAccessoryBelowBody"}},
                        {method:this.builder.setTorso,parameters:{id:this.parts.skincolor+2000,z:"skincolor"}},
                        {method:this.builder.setCoat,parameters:{id:this.parts.coat,z:"mailChestBelowPants"}},
                        {method:this.builder.setLongCoat,parameters:{id:this.parts.coat,z:"mailChestBelowPants"}},
                        {method:this.builder.setPants,parameters:{id:this.parts.pants,z:"pantsBelowShoes"}},
                        {method:this.builder.setShoes,parameters:{id:this.parts.shoes,z:"shoes"}},
                        {method:this.builder.setPants,parameters:{id:this.parts.pants,z:"pants"}},
                        {method:this.builder.setShoes,parameters:{id:this.parts.shoes,z:"shoesOverPants"}},
                        {method:this.builder.setLongCoat,parameters:{id:this.parts.coat,z:"mailChestOverPants"}},                        
                        {method:this.builder.setCoat,parameters:{id:this.parts.coat,z:"mailChest"}},
                        {method:this.builder.setLongCoat,parameters:{id:this.parts.coat,z:"mailChest"}},
                        {method:this.builder.setLongCoat,parameters:{id:this.parts.coat,z:"mailChestOverHighest"}},
                        {method:this.builder.setHead,parameters:{id:this.parts.skincolor+2000,z:"skincolor"}},
                        {method:this.builder.setAccessory,parameters:{id:this.parts.ears,z:"accessoryEar"}},
                        {method:this.builder.setAccessory,parameters:{id:this.parts.mask,z:"accessoryFaceBelowFace"}},
                        {method:this.builder.setFace,parameters:{id:this.parts.face,z:"face"}},
                        {method:this.builder.setAccessory,parameters:{id:this.parts.mask,z:"accessoryFace"}},
                        {method:this.builder.setAccessory,parameters:{id:this.parts.eyes,z:"accessoryEye"}},
                        {method:this.builder.setHair,parameters:{id:this.parts.hair,z:"hairShade"}},
                        {method:this.builder.setHair,parameters:{id:this.parts.hair,z:"hair"}},
                        {method:this.builder.setHair,parameters:{id:this.parts.hair,z:"hairOverHead"}},
                        {method:this.builder.setCap,parameters:{id:this.parts.cap,z:"cap"}},
                        {method:this.builder.setGloves,parameters:{id:this.parts.glove,z:"gloveOverBody"}},
                        {method:this.builder.setWeapon,parameters:{id:this.parts.weapon,z:"weapon"}},
                        {method:this.builder.setArm,parameters:{id:this.parts.skincolor+2000}},
                        {method:this.builder.setCoat,parameters:{id:this.parts.coat,z:"mailArm"}},
                        {method:this.builder.setLongCoat,parameters:{id:this.parts.coat,z:"mailArm"}},
                        {method:this.builder.setWeapon,parameters:{id:this.parts.weapon,z:"weaponOverArm"}},
                        {method:this.builder.setHands,parameters:{id:this.parts.skincolor+2000}},
                        {method:this.builder.setGloves,parameters:{id:this.parts.glove,z:"glove"}},
                        {method:this.builder.setGloves,parameters:{id:this.parts.glove,z:"gloveOverHair"}},
                    ],
                    ()=>
                    {
                        this.builder.outputImage(this.builder.canvas,__dirname + "/Characters/"+name+".png",()=>
                        {
                            callback({success:true});
                        });
                    }
                );
            });
        });
    }

}
module.exports = MapleCharacterGenerator; 