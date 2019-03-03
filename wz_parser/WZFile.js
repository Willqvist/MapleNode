const WZReader = require("./WZReader");
const WZNode = require("./WZNode");
const WZDirectory = require("./WZDirectory");
const Tools = require("./Tools");
const async = require("async");
class WZFile extends WZNode
{
    constructor(filename,buffer,version)
    {
        super();
        this.name = filename;
        this.fileVersion = -1;
        this.wzKey = Tools.getIVKeyByVersion(version);
        this.reader = new WZReader(buffer,this.wzKey);
    }
    setFileVersion(ver)
    {
        this.fileVersion = ver;
    }
    parse(err)
    {
        this.wzName = this.reader.readString(4);
        console.log(this.wzName);
        this.size = this.reader.readInt64();
        this.contentStart = this.reader.readInt32();
        this.copyright = this.reader.readZString();

        this.reader.seek(this.contentStart);
        this.reader.header = 
        {
            name:this.name,
            size:this.size,
            contentStart:this.contentStart
        };
        this.version = this.reader.readInt16();
        return this.hash();
    }
    hash()
    {
        if(this.fileVersion == -1)
        {
            //short max value=32767
            for(let i = 0; i < 32767; i++)
            {
                this.fileVersion = i;
                this.versionHash = this.getVersionHash(this.version,this.fileVersion);
                console.log("file version:",this.version," trying: ",i," got versionHash:",this.versionHash);
                if(this.versionHash != 0)
                {
                    this.reader.hash = this.versionHash;
                    let position = this.reader.pos;
                    let directory = null;
                    try
                    {
                        directory = new WZDirectory(this.reader,this.name,this.versionHash,this.WzIv,this);
                        directory.parse();
                    }catch(err){
                        this.reader.pos = position;
                        continue;
                    }
                    let image = directory.getChildImage(0);
                    try
                    {
                        this.reader.seek(image.offset);
                        let checkByte = this.reader.readByte();
                        this.reader.seek(position);
                        directory.dispose();
                        console.log("byte: ",checkByte);
                        switch(checkByte)
                        {
                            case 0x73:
                            case 0x1b:
                            {
                                let directory = new WZDirectory(this.reader,this.name,this.versionHash,this.WzIv,this);
                                directory.parse();
                                this.wzDir = directory;
                                return true;
                            }
                        }
                        this.reader.seek(position);
                    }   
                    catch(err)
                    {
                        this.reader.seek(position);
                    }
                }
            }
        }
        else
        {
            this.versionHash = this.getVersionHash(this.version,this.fileVersion);
            reader.Hash = this.versionHash;
            let directory = new WzDirectory(this.reader, this.name, this.versionHash, this.WzIv, this);
            directory.ParseDirectory();
            this.wzDir = directory; 
            return true;
        }
        return false;
    }
    getVersionHash(encrypted_version,real_version)
    {
        let encryptedVersionNumber = encrypted_version;
        let versionNumber = real_version;
        let versionHash = 0;
        let decryptedVersionNumber = 0;
        let VersionNumberString;
        let a=0,b=0,c=0,d=0,length=0;

        VersionNumberString = versionNumber + "";

        length = VersionNumberString.length;
        for(let i = 0; i < length; i++)
        {
            versionHash = (32*versionHash) + VersionNumberString.charCodeAt(i) + 1;
        }
        a = (versionHash >> 24) & 0xFF;
        b = (versionHash >> 16) & 0xFF;
        c = (versionHash >> 8) & 0xFF;
        d = versionHash & 0xFF;
        decryptedVersionNumber = (0xff ^ a ^ b ^ c ^ d);
        if(encryptedVersionNumber == decryptedVersionNumber)
        {
            return parseInt(versionHash);
        }
        return 0;
    }
    setType(type)
    {
        if(type==null) return false;
        this.type = type;
        this.type.err = false;
        this.type.wzFile = this;
        return true;
    }
    saveType(callback)
    {
        if(!this.type) return;
        this.stop = true;
        /*
        var self = this;
        async.each(this.wzDir.getDeepSubDirectories(),function(dir,next_dir)
        {
            let imgs = dir.getChildImages();
            async.each(imgs,function(element,next_img)
            {
                let props = self.getAllProperties(element);
                async.each(props,function(prop,next)
                {
                    if(!self.stop) return next(true);
                    try
                    {
                        self.type.parse(prop,next);
                    }
                    catch(err)
                    {
                        console.trace(err);
                        self.stop = false;
                        self.type.err = true;
                        //this.type.error();
                        //next(true);
                    }
                },function(err)
                {
                    if(err) throw err;
                    next_img();
                });

            },function(err)
            {
                if(err) throw err;
                next_dir();
            });

        },function(err)
        {
            if(err) throw err;
            if(!self.type.err)
                self.type.parsed();
        
            return callback(self.stop);
        });
        */
        let dirs = this.wzDir.getDeepSubDirectories();
        dirs.forEach(dir => {
            //console.log(dir.getPath(),dir.getChildImages().length);
            dir.getChildImages().forEach(element => {
                //console.log(element.getProperties().length);
                this.getAllProperties(element).forEach(elem => {
                    if(!this.stop) return;
                    try
                    {
                        this.type.parse(elem,()=>{});
                    }
                    catch(err)
                    {
                        console.log(err);
                        this.stop = false;
                        this.type.err = true;
                        this.type.error();
                    }
                });
            });
        });
        if(!this.type.err)
            this.type.parsed();

        return callback(this.stop);
    }
    getAllProperties(element)
    {
        let props = [];
        props.push(element);
        for(let i = 0; i < element.props.length; i++)
        {
            props = props.concat(this.getAllProperties(element.props[i]));
        }
        return props;
    }
}
module.exports = WZFile;