const ExeLogger = require("./ExeLogger");
const CmdLogger = require("./CmdLogger");
class Logger{
    static setLogger(logger)
    {
        Logger.logger = logger;
    }
    static log(msg)
    {
        Logger.logger.log(msg);
    }
    static error(msg)
    {
        Logger.logger.error(msg);
    }
    static warn(msg)
    {
        Logger.logger.warn(msg);
    }
    
    static info(msg)
    {
        Logger.logger.info(msg);
    }
}
Logger.loggers = 
{
    exe:ExeLogger,
    cmd:CmdLogger
};
Logger.logger = CmdLogger;
module.exports = Logger;