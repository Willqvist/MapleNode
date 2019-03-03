const WZNode = require("../WZNode");
const fs = require("graceful-fs");
const ImageStorer = require("../ImageStorer");
const JSONStream = require('JSONStream');
class ImageProperty extends WZNode
{
    constructor(name)
    {
        super(name);
        this.props = [];
        this.type="DEFAULT";
    }
    addProperties(props)
    {
        props.forEach(prop => {
            this.addProperty(prop);
        });
    }
    parentImg()
    {
        let parent = this.parent;
        while(parent != null)
        {
            if(parent.isWZImage) return parent;
            else parent = parent.parent;
        }
        return null;
    }
    parentDirectory()
    {
        let parent = this.parent;
        while(parent != null)
        {
            if(parent.isWzDir) return parent;
            else parent = parent.parent;
        }
        return null;       
    }
    getProperties(type)
    {
        if(!type)
            return this.props;
        let props_type = [];
        this.props.forEach(element => {
            //console.log(element.type);
            if(element.type==type)
                props_type.push(element);
        });
        return props_type;
    }
    addProperty(prop)
    {
        prop.setParent(this);
        this.props.push(prop);
    }
    storeMeta(dir,meta,callback)
    {
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir);
        let json;
        if(!meta)
            json = JSON.stringify(this.getPropertyValue());
        else
            json = JSON.stringify(meta);

        let stream = fs.createWriteStream(dir+'meta.json');
            stream.write(json);
        stream.end();

        callback();
    }
    getPropertyValue()
    {
        let obj = {};
        if(!this.props) return {value:"NULL"};
        this.props.forEach(property => {
            switch(property.type)
            {
                case "VECTOR":
                    obj[property.name] = {x:property.x,y:property.y};
                    break;
                case "COMPRESSED_INT":
                case "BYTE_FLOAT":
                case "DOUBLE":
                case "STRING":
                case "UNSIGNED_SHORT":
                case "COMPRESSED_INT":
                case "UOL":
                    obj[property.name] = {value:property.value};
                    break;
                case "CONVEX":
                case "SUB":
                case "CANVAS":
                    obj[property.name] = property.getPropertyValue(); 
                    break;
            }
        });
        return obj;   
    }
}
module.exports = ImageProperty;