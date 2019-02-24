const mysql = require("../Tools/mysql").getMysql();
const Queue = require('../Tools/Queue');
const ImageStorer = require("./ImageStorer");
const progress = require("../Tools/ProgressUpdater");

class WZType
{
    static getType(str,callback)
    {
        if(str.includes("String")) return new WZString(callback);
        if(WZType.includes(str,"Item","Mob","Etc","Map","Base")) return new WZPng(callback);
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
}


class WZString extends WZType
{
    constructor()
    {
        super();
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
        super();
        this.callback = callback;
        ImageStorer.getInstance().setCallbackComplete(()=>
        {
            this.callback({wz:this.wzFile,err:{hasError:this.err}})
        });

    }
    parsed()
    {
        console.log("done with WZPng Type!");
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
            property.png.storePng("./library/v62/Item/",metaData);
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