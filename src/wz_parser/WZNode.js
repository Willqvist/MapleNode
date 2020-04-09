class WZNode
{
    constructor(name)
    {
        this.name = name;
        this.parent = null;
    }
    parse()
    {
        throw new Error("parse not implemented!");
    }
    getPath()
    {
        if(this.parent != null)
        {
            return this.parent.getPath() + "/" + this.name;
        }
        return this.name;
    }
    setParent(parent)
    {
        this.parent = parent;
        return this;
    }
}
module.exports = WZNode;