import Logger from "./Logger";
export default class CmdLogger extends Logger
{
    protected log(msg)
    {
        console.log(msg);
        CmdLogger.ping(msg);
    }
    protected error(msg)
    {
        console.log("\x1b[31m"+msg+"\x1b[0m");
        CmdLogger.ping(msg);
    }
    protected warn(msg)
    {
        console.log("\x1b[33m"+msg+"\x1b[0m");
        CmdLogger.ping(msg);
    }
    protected info(msg)
    {
        console.log(msg);
        CmdLogger.ping(msg);
    }

    protected clear(): void {
        this.log("MapleNode>");
    }

}
