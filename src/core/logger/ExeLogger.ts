import Time from "../tools/Time";
import Logger from "./Logger";
export default class ExeLogger extends Logger
{
    protected log(msg)
    {
        console.log(`[${Time.getTime()} LOG]     : ${msg}`); 
    }
    protected error(msg)
    {
        console.log(`[${Time.getTime()} ERROR]   : ${msg}`);
    }
    protected info(msg)
    {
        console.log(`[${Time.getTime()} INFO]    : ${msg}`);   
    }
    protected warn(msg)
    {
        console.log(`[${Time.getTime()} WARNING] : ${msg}`);
    }

    protected clear(): void {
        this.log("MapleNode>");
    }
}
