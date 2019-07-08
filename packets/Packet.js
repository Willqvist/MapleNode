class Packet
{
    init(app,req,res){
        this.req = req;
        this.res = res;
        this.global = app.locals;
    }
    serverSetVariable(variable)
    {
        this.res.locals = variable
    }
    onPageLoad(req,res,callback){callback();};
}
module.exports = Packet;