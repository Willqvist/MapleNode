const ErrorHandler = require("./ErrorHandler");
const WZNode = require("./WZNode");
const WZImage = require("./WZImage");
const WZProperty = require("./WZProperty");

class WZDirectory extends WZNode
{
    constructor(reader,name,hash,wzIv,wzFile)
    {
        super(name);
        this.reader = reader;
        this.hash = hash;
        this.wzIv = wzIv;
        this.wzFile = wzFile;
        this.subDirs = [];
        this.imgs = [];
        this.isWzDir = true;
    }
    getMetaData()
    {
        let obj = {}
        this.getSubDirectories().forEach(dir => {
            obj[dir.name] = {};
            dir.getChildImages().forEach(img => {
                obj[dir.name][img.name] = WZProperty.getPropertyValue(img);
            });
        });
        return obj;
    }
    getChildImages()
    {
        let imgs = this.imgs.slice();
        this.subDirs.forEach(dir => {
            imgs = imgs.concat(dir.getChildImages());
        });
        return imgs;
    }
    getSubDirectories()
    {
        return this.subDirs;
    }
    getAllSubDirectories(callback)
    {
        if(this.subDirs.length==0)
        {
            callback(this);
            return;
        }
        this.subDirs.forEach(dir=>
        {
            dir.getAllSubDirectories(callback);
        });
    }
    getDeepSubDirectories(index = 0)
    {
        let dirs = this.subDirs.slice();
        dirs.forEach(dir => {
            dirs = dirs.concat(dir.getDeepSubDirectories(++index));
        });
        return dirs;      
    }
    getChildImage(index)
    {
        if(index > this.imgs.length)
            return null;
        return this.imgs[index];
    }
    parse()
    {
        let entryCount = this.reader.readWZInt();
        console.log("path",this.getPath(),"entry count: "," parent: ",(this.parent == null ? "":this.parent.name));
        for(let i = 0; i < entryCount; i++)
        {
            let type = this.reader.readByte();
            let fname;
            let fsize;
            let checksum;
            let offset;
            let rememberPos = this.reader.pos;
            //console.log(type);
            switch(type)
            {
                case 1:
                {
                    this.reader.readInt32();
                    this.reader.readInt16();
                    this.reader.readOffset();
                }
                case 2:
                {
                    let stringOffset = this.reader.readInt32();
                    rememberPos = this.reader.pos();
                    this.reader.skip(stringOffset);
                    type = this.reader.readByte();
                    fname = this.reader.readString();
                }
                case 3:
                case 4:
                {
                    //console.log("pos: ", this.reader.pos);
                    fname = this.reader.readEncryptedString();
                    //console.log("fname: ", fname);
                    rememberPos = this.reader.pos;
                }
            }
            this.reader.seek(rememberPos);
            fsize = this.reader.readWZInt();
            checksum = this.reader.readWZInt();
            offset = this.reader.readOffset();
            if(type==3)
            {
                let subDir = new WZDirectory(this.reader,fname,this.hash,this.wzIv,this.wzFile);
                subDir.blockSize = fsize;
                subDir.checksum = checksum;
                subDir.offset = offset;
                subDir.parent = this;
                this.subDirs.push(subDir);
            }
            else
            {
                let img = new WZImage(fname,this.reader);
                img.blockSize = fsize;
                img.checksum = checksum;
                img.offset = offset;
                img.parent = this;
                this.imgs.push(img);
            }
        }
        for(let i = 0; i < this.subDirs.length; i++)
        {
            let dir = this.subDirs[i];
            this.reader.seek(dir.offset);
            dir.parse();
        };
        return ErrorHandler.noError("complete");
    }
    parseImages()
    {
        this.imgs.forEach(img => {
            if(this.reader.pos != img.offset)
                this.reader.seek(img.offset);
            img.parse();
        });
        this.subDirs.forEach(dir => {
            if(this.reader.pos != dir.offset)
                this.reader.seek(dir.offset);
            dir.parseImages();
        });
    }
    dispose()
    {
        this.name = null;
        this.reader = null;
        this.imgs.forEach(img => {
            img.dispose();
        });
        this.subDirs.forEach(dir => {
            dir.dispose();
        });
        this.imgs = [];
        this.subDirs = [];
        this.imgs = null;
        this.subDirs = null;
    }
}
module.exports = WZDirectory;