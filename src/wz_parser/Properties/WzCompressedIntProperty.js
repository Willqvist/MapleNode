const ImageProperty = require("./ImageProperty");
class WzCompressedIntProperty extends ImageProperty
{
    constructor(name,value)
    {
        super(name);
        this.value = value;
        this.type="COMPRESSED_INT";
    }
}
module.exports = WzCompressedIntProperty;