const ImageProperty = require("./ImageProperty");
class WzVectorProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="VECTOR";
        this.x = -1;
        this.y = -1;
    }
}
module.exports = WzVectorProperty;