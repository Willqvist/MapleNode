const mysql = require("../Tools/mysql").getMysql();
const Queue = require('../Tools/Queue');
const ImageStorer = require("./ImageStorer");
const progress = require("../Tools/ProgressUpdater");

class WZType
{
    static getType(str,callback)
    {
        if(str.includes("String")) return new WZString(callback);
        if(str.includes("Mob")) return new WZMob(callback);
        if(str.includes("Character")) return new WZCharacter(callback);
        if(WZType.includes(str,"Item","Mob","Etc","Map","Base")) return new WZPng(callback);
        return null;
    }
    static includes(str,...args)
    {
        let s = false;
        args.forEach(e => {
            console.log(e,str,str.includes(e));
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
    constructor(callback)
    {
        this.callback = callback;
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
        });

        WZString.meta = {};
        WZString.meta["Special.img"] = {};
    }
    parsed()
    {
        this.callback({wz:this.wzFile,err:{hasError:this.err}});
    }
    toEight(type,str)
    {
        if(isNaN(str.charAt(0)) || type=="Pet.img") return str;
        if(str.length < 8) return this.toEight(type,"0"+str);
        return str;
    }
    parse(prop)
    {
        if(prop.type=="STRING" && prop.parent.type=="SUB")
        {
            //prop.storeMeta("./library/v62/String/"+prop.name+"/");
            let type = prop.parentImg().name;
            let id = this.toEight(type,prop.parent.name);
            //console.log(name);
            if(!WZString.meta[type])
                WZString.meta[type] = {};
            if(prop.name=="name" || prop.name=="desc")
            {
                let {name,desc} = prop.parent.getPropertyValue();
                //console.log(id,desc);
                name = !name ? "" : name.value;
                desc = !desc ? "" : desc.value;
                if(type=="Mob.img")
                console.log(type,id,name);
                
                if(SpecialStrings.isSpecial(id))
                {
                    console.log(id,SpecialStrings.isSpecial(id),name);
                    name = SpecialStrings.isSpecial(id);
                    WZString.meta["Special.img"][id] = {name:name,desc:desc};
                    return;
                }
                WZString.meta[type][id] = {type:type.replace(".img",""),id:id,name:name,desc:desc};
                //console.log(WZString.meta[type][id]); 
                this.queue.push(WZString.meta[type][id]);  
            }
        }
    }
}


class WZPng extends WZType
{
    constructor(callback)
    {
        super(callback);
        this.storer = new ImageStorer();
        this.storer.setCallbackComplete(()=>
        {
            this.callback({wz:this.wzFile,err:{hasError:this.err}})
        });

    }
    parsed()
    {
        console.log("done with WZPng Type!");
        this.storer.complete();
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
    parse(property)
    {
        if(property.type=="CANVAS")
        {
            let metaData = property.parent.parent.getPropertyValue();
            console.log(metaData);
            let parentImg = property.parent.parent.name;
            let parentDir = property.parentDirectory();
            //console.log(parentImg.replace(".img",""));
            let id = parentImg.replace(".img","");
            //console.log("parent img: ",id);
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
            console.log();
            property.png.storePng(this.storer,"./library/v62/Item/",metaData);
        }
    }
}

class WZMob extends WZType
{
    constructor(callback)
    {
        super(callback);
        this.storer = new ImageStorer();
        this.storer.setCallbackComplete(()=>
        {
            console.log("complete");
            this.callback({wz:this.wzFile,err:{hasError:this.err}})
        });
    }
    parsed()
    {
        console.log("done with WZPng Type!");
        this.storer.complete();
        //this.callback({wz:this.wzFile,err:{hasError:this.err}});
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
    parse(property)
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
                property.parentImg().storeMeta("./library/v62/Mob/"+id+"/",meta);
            }
        }


        if(property.type == "CANVAS")
        {
            let name = property.parent.name + "_" + property.name;
            property.png.storePng(this.storer,"./library/v62/Mob/",{filename:name});
        }
    }    
}

class WZCharacter extends WZType
{
    constructor(callback)
    {
        super(callback);
        this.storer = new ImageStorer();
        this.storer.setCallbackComplete(()=>
        {
            console.log("complete!!");
            this.callback({wz:this.wzFile,err:{hasError:this.err}})
        });
    }
    parsed()
    {

        console.log("done with WZPng Type!");
        this.storer.complete();
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
    parse(property)
    {
        if(property.type == "CANVAS" && (property.name == "icon" || property.name == "iconRaw"))
        {
            console.log(property.name,property.parentImg().name,property.parentImg().parent.name);
            //console.log(property.png);
            property.png.storePng(this.storer,"./library/v62/Eqp/",{name:"empty right now!!! TODO",type:property.parentImg().parent.name});
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