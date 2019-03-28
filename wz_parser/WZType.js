const mysql = require("../Tools/mysql").getMysql();
const Queue = require('../Tools/Queue');
const fs = require("graceful-fs");
const ImageStorer = require("./ImageStorer");
class WZType
{
    static getType(str,callback)
    {
        if(str.includes("String")) return new WZString(callback);
        if(str.includes("Mob")) return new WZMob(callback);
        if(str.includes("Character")) return new WZCharacter(callback);
        if(WZType.includes(str,"Item","Etc","Map","Base")) return new WZPng(callback);
        return null;
    }
    static includes(str,...args)
    {
        let s = false;
        args.forEach(e => {
            if(str.includes(e))
            {
                s = true;
                return true;
            }
        });
        return s;
    }
    parse()
    {
        throw new Error("parse not included!");
    }
    error()
    {
        this.callback({err:{hasError:true}});
    }
    parsed()
    {
        throw new Error("parsed not included!");
    }
    writeMeta(dest,property,data)
    {
        let dir = dest+property.parent.parent.parent.name.replace(".img","")+"/";
        this.writeMetaDir(dir,property,data);
    }
    writeMetaDir(dir,property,meta)
    {
        if(!this.metaSaved[dir])
        {
            //console.log(++this.f,dir);
            property.storeMeta(dir,meta,(err)=>{
                this.metaSaved[dir] = {};
            });
        }
    }
    constructor(callback)
    {
        this.callback = callback;
        this.metaSaved = {};
        this.f = 0;
        this.storer = new ImageStorer();
        this.storer.setCallbackComplete(()=>
        {
            this.callback({wz:this.wzFile,err:{hasError:this.err}});
        });
    }
}


class WZString extends WZType
{
    constructor(callback)
    {
        super(callback);
        this.inserted = {};
        this.queue = new Queue((element, cb)=>{
            mysql.connection.query(`SELECT id FROM library_v62 WHERE id=${element.id}`,((err,result)=>
            {
                if (err) throw err;
                if(result.length > 0) return cb();
                //console.log(element.name.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/'/g, "\\'").replace(/"/g, "\\\""));
                mysql.connection.query(`INSERT INTO library_v62 (name,id,type) VALUES("${element.name.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/'/g, "\\'").replace(/"/g, "\\\"")}",'${element.id}','${escape(element.type)}')`,((err,res)=>
                {
                    if (err) throw err;
                    cb();
                }).bind(cb));
           
            }).bind(cb));
        },()=>
        {
            this.callback({wz:this.wzFile,err:{hasError:this.err}}); 
        });

        WZString.meta = {};
        WZString.meta["Special.img"] = {};
    }
    parsed()
    {
        this.callback({wz:this.wzFile,err:{hasError:this.err}});
        //this.queue.process();
    }
    toEight(type,str)
    {
        if(isNaN(str.charAt(0)) || type=="Pet.img") return str;
        if(str.length < 8) return this.toEight(type,"0"+str);
        return str;
    }
    parse(prop,next)
    {
        if(prop.type=="STRING" && prop.parent.type=="SUB")
        {
            let type = prop.parentImg().name;
            let id = this.toEight(type,prop.parent.name);

            if(!WZString.meta[type])
                WZString.meta[type] = {};
            if(prop.name=="name" || prop.name=="desc")
            {
                let {name,desc} = prop.parent.getPropertyValue();

                name = !name ? "" : name.value;
                desc = !desc ? "" : desc.value;
                
                if(SpecialStrings.isSpecial(id))
                {
                    name = SpecialStrings.isSpecial(id);
                    WZString.meta["Special.img"][id] = {name:name,desc:desc};
                    return next();
                }
                WZString.meta[type][id] = {type:type.replace(".img",""),id:id,name:name,desc:desc};

                this.queue.push(WZString.meta[type][id]); 
            }
        }
        next();
    }
}


class WZPng extends WZType
{
    constructor(callback)
    {
        super(callback);
    }
    parsed()
    {
        console.log("done with WZPng Type!");
        this.callback({wz:this.wzFile,err:{hasError:this.err}});
    }
    removeTrailingZeros(str)
    {
        if(str.charAt(0)=='0')
        {
            return this.removeTrailingZeros(str.substring(1));
        }
        return str;
    }
    parse(property,next)
    {
        if(property.type=="CANVAS")
        {
            let metaData = property.parent.parent.getPropertyValue();
            let parentImg = property.parent.parent.name;
            let parentDir = property.parentDirectory();

            let id = parentImg.replace(".img","");

            let parentName = parentDir.name+".img";
            if(WZString.meta[parentName] && WZString.meta[parentName][id])
            {
                metaData["name"] = WZString.meta[parentName][id].name;
                metaData["desc"] = WZString.meta[parentName][id].desc;
            }
            else
            {
                metaData["name"] = "Undefined";
                metaData["desc"] = "Undefined";
            }
            this.writeMetaDir("./library/v62/Item/"+id+"/",property,metaData);
            property.png.storePng(this.storer,"./library/v62/Item/",next);
            return;
        }
        next();
    }
}

class WZMob extends WZType
{
    constructor(callback)
    {
        super(callback);
    }
    parsed()
    {
        console.log("parsed!");
        this.callback({wz:this.wzFile,err:{hasError:this.err}});
    }
    toEight(type,str)
    {
        if(isNaN(str.charAt(0)) || type=="Pet.img") return str;
        if(str.length < 8) return this.toEight(type,"0"+str);
        return str;
    }
    removeTrailingZeros(str)
    {
        if(str.charAt(0)=='0')
        {
            return this.removeTrailingZeros(str.substring(1));
        }
        return str;
    }
    parse(property,next)
    {
        if(property.type == "SUB" && property.name == "info")
        {
            let meta = {};
            property.getProperties().forEach((prop)=>
            {
                meta[prop.name] = prop.value;
            });
            
            let id = property.parent.name.replace(".img","");
            let mob_meta = WZString.meta["Mob.img"][this.toEight("Mob.img",id)];
            if(mob_meta)
            {
                meta.name = mob_meta.name;
                meta.desc = mob_meta.desc;
                //property.parentImg().storeMeta("./library/v62/Mob/"+id+"/",meta,next);
                this.writeMetaDir("./library/v62/Mob/"+this.pad8(id)+"/",property.parentImg(),meta);
                return next();
            }
            else
                return next();
        }

        if(property.type == "CANVAS" && (property.parent.name == "walk" || property.parent.name == "stand" || property.parent.name == "die"))
        {
            let name = property.parent.name + "_" + property.name;
            property.png.storePng(this.storer,"./library/v62/Mob/",next,name);
        }
    } 
    pad8(str)
    {
        return str.padStart(8,'0');
    }   
}

class WZCharacter extends WZType
{
    constructor(callback)
    {
        super(callback);
    }
    parsed()
    {

        console.log("done with WZPng Type!");
        this.callback({wz:this.wzFile,err:{hasError:this.err}});
        //this.callback({wz:this.wzFile,err:{hasError:this.err}});
    }
    removeTrailingZeros(str)
    {
        if(str.charAt(0)=='0')
        {
            return this.removeTrailingZeros(str.substring(1));
        }
        return str;
    }
    parse(property,next)
    {
        if(property.type == "CANVAS" && (property.name == "icon" || property.name == "iconRaw"))
        {
            let id = property.parent.name.replace(".img","");
            //console.log(property.png);
            this.writeMetaDir("./library/v62/Eqp/"+id+"/",property,{name:"empty right now!!! TODO",type:property.parentImg().parent.name})
            property.png.storePng(this.storer,"./library/v62/Eqp/",next);
        }
    }    
}

class SpecialStrings
{
    constructor()
    {

    }
    static isSpecial(str)
    {
        return SpecialStrings.special[str];
    }
}
SpecialStrings.special = {
    "09000000":"Meso",
    "09000001":"Gold Meso",
    "09000002":"Meso bills",
    "09000003":"Meso Sack"
};
module.exports = WZType;