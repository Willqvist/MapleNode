const ImageProperty = require("./ImageProperty");
class WzUOLProperty extends ImageProperty
{
    constructor(name,value)
    {
        super(name);
        this.value = value;
        this.type="UOL";
    }
}
module.exports = WzUOLProperty;