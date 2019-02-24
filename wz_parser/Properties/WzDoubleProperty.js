const ImageProperty = require("./ImageProperty");
class WzDoubleProperty extends ImageProperty
{
    constructor(name,value)
    {
        super(name);
        this.value = value;
        this.type="DOUBLE";
    }
}
module.exports = WzDoubleProperty;