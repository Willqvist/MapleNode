class ErrorHandler
{
    constructor(callback)
    {
        this.callback = callback;
    }
    static panic(msg)
    {

    }
    static createError(msg)
    {
        return {failed:true,reason:msg};
    }
    static noError(msg)
    {
        return {failed:false,reason:msg};  
    }
}
module.exports = ErrorHandler;