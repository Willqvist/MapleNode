const ImageProperty = require("./ImageProperty");
class WZUnsignedShortProperty extends ImageProperty
{
    constructor(name,value)
    {
        super(name);
        this.value = value;
        this.type="UNSIGNED_SHORT";
    }
}
module.exports = WZUnsignedShortProperty;