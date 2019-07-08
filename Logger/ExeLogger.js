const Time = require("../Tools/Time");
class ExeLogger
{
    static log(msg)
    {
        console.log(`[${Time.getTime()} LOG]     : ${msg}`); 
    }
    static error(msg)
    {
        console.log(`[${Time.getTime()} ERROR]   : ${msg}`); 
    }
    static info(msg)
    {
        console.log(`[${Time.getTime()} INFO]    : ${msg}`);   
    }
    static warn(msg)
    {
        console.log(`[${Time.getTime()} WARNING] : ${msg}`);   
    }
}
module.exports = ExeLogger;