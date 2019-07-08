class CmdLogger
{
    static log(msg)
    {
        console.log(msg);
    }
    static error(msg)
    {
        console.log("\x1b[31m"+msg+"\x1b[0m");
    }
    static warn(msg)
    {
        console.log("\x1b[33m"+msg+"\x1b[0m");
    }
    static info(msg)
    {
        console.log(msg);
    }
    static stream(strm)
    {
        Logger.stream = strm;
    }

}
module.exports = CmdLogger;