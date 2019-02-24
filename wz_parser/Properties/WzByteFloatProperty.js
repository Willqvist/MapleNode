const ImageProperty = require("./ImageProperty");
class WzByteFloatProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="BYTE_FLOAT";
    }
}
module.exports = WzByteFloatProperty;