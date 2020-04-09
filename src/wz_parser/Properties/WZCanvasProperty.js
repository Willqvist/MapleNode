const ImageProperty = require("./ImageProperty");
class WZCanvasProperty extends ImageProperty
{
    constructor(name)
    {
        super(name);
        this.type="CANVAS";
    }
}
module.exports = WZCanvasProperty;