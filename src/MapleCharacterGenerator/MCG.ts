import {PartsInterface} from "../core/Interfaces/Interfaces";

import ItemBuilderXml from "./ItemBuilderXml";
import ItemBuilderJson from "./ItemBuilderJson";
import util from "util";
import fs from "fs";
import * as Constants from "../core/Constants";
import DatabaseConnection from "../core/database/DatabaseConnection";
import { resolve } from "dns";

export interface Player{
    parts: PartsInterface;
    name : string,
    items: any[],
    callback : (a:any)=>void;
}

export interface EqiupItem {
    method:(id : number,z : string,next : ()=>void)=>void;
    parameters:{id:number,z:string}
}

enum ERROR {
    INVALID_PLAYER,
    CANT_FIND_ITEM
}

export default class MapleCharacterGenerator
{
    private cooldown: number;
    private parts:PartsInterface;
    private que : Player[];
    private generators: { Xml: any; Json: any };
    private builder : any;
    constructor(cooldown : number)
    {
        this.cooldown = cooldown*0;
        this.parts = {};
        this.que = [];
        this.generators = {
            "Xml":new ItemBuilderXml(),
            "Json":new ItemBuilderJson()
        }
    }
    addToQueue(player : Player)
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
    removeFromQueue(index : number)
    {
        this.que.splice(index,1);
    }

    exists(file: string) : Promise<boolean> {
        return new Promise(resolve => {
            fs.access(file,fs.constants.R_OK,(err)=> {
                resolve(!err);
            })
        });
    }

    stats(file: string) : Promise<fs.Stats> {
        return new Promise(resolve => {
            fs.stat(file,(err,stat)=> {
                if(err) resolve(null);
                resolve(stat);
            })
        });
    }

    async generatePlayer(callback: (a:any)=>any,name : string)
    {
        if(!this.builder)
            this.builder = this.generators[Constants.getConstant<string>("MCG")];
        let player : Player = {parts:{},name:name,callback:callback,items:[]};
        if(await this.exists(__dirname + "/Characters/"+name+".png"))
        {
            let stat = await this.stats(__dirname + "/Characters/"+name+".png");
            let date = new Date(util.inspect(stat.mtime));
            let dateNow = new Date();
            if((dateNow.getMinutes()-date.getMinutes())/1000 < this.cooldown)
                return callback({success:true});
        }
        try {
            let result = await DatabaseConnection.instance.getCharacter(name,{select:["face","hair","skincolor"]});
            if(!result)
                return {success:false,errorID:ERROR.INVALID_PLAYER,reason:"cant find player: " + name};
            player.parts.face = result.face;
            player.parts.hair = result.hair;
            player.parts.skincolor = result.skincolor;
            let results = await DatabaseConnection.instance.getEquipment(result.id);
            player.items = results;
            this.addToQueue(player);
        } catch(err) {
            throw err;
        }
    }
    buildPlayer(player : Player)
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
            (player : Player)=>
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
