const ImageProperty = require("./Properties/ImageProperty");
const WZProperty = require("./WZProperty");
class WZImage extends ImageProperty
{
    constructor(name,reader)
    {
        super(name);
        this.reader = reader;
        this.blockStart = this.reader.pos;
        this.parsed = false;
        this.isWZImage = true;
    }
    parse(parseEverything = false)
    {
        //if(this.parsed && this.parseEverything) return;
        this.parsed = true;
        this.parseEverything = parseEverything;
        this.originalPos = this.reader.pos;
        this.reader.seek(this.offset);
        let byte = this.reader.readByte();

        if(byte != 0x73 || this.reader.readEncryptedString() != "Property" || this.reader.readUInt16() != 0)
            return;
        this.props = WZProperty.parseList(this.offset,this.reader,this,this);
    }
    dispose()
    {
        this.reader = null;
        this.blockStart = null;
        this.name = null;
    }
}
module.exports = WZImage;