export default abstract class Logger{
    private static logger : Logger;
    static setLogger(logger : Logger)
    {
        Logger.logger = logger;
    }
    static log(msg : string)
    {
        Logger.logger.log(msg);
    }
    static error(msg : string)
    {
        Logger.logger.error(msg);
    }
    static warn(msg : string)
    {
        Logger.logger.warn(msg);
    }
    
    static info(msg : string)
    {
        Logger.logger.info(msg);
    }

    protected abstract info(msg : string) : void;
    protected abstract warn(msg : string) : void;
    protected abstract error(msg : string) : void;
    protected abstract log(msg : string) : void;
}