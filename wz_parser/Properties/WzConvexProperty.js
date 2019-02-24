const ImageProperty = require("./ImageProperty");
class WzConvexProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="CONVEXED";
    }
}
module.exports = WzConvexProperty;