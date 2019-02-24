const ImageProperty = require("./ImageProperty");
class WZNullProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="NULL";
    }
}
module.exports = WZNullProperty;