const ImageProperty = require("./ImageProperty");
class WzStringProperty extends ImageProperty
{
    constructor(name,value)
    {
        super(name);
        this.value = value;
        this.type="STRING";
    }
}
module.exports = WzStringProperty;