const ImageProperty = require("./ImageProperty");
class WzSubProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="SUB";
    }
}
module.exports = WzSubProperty;