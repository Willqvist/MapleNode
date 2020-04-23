export default abstract class Logger{
    private static logger : Logger;
    private static listeners : ((data)=>void)[] = [];
    static setLogger(logger : Logger)
    {
        Logger.logger = logger;
    }
    static log(msg : string)
    {
        if(Logger.logger)
            Logger.logger.log(msg);
    }
    static error(msg : string)
    {
        if(Logger.logger)
            Logger.logger.error(msg);
    }
    static warn(msg : string)
    {
        if(Logger.logger)
            Logger.logger.warn(msg);
    }
    
    static info(msg : string)
    {
        if(Logger.logger)
            Logger.logger.info(msg);
    }

    static clear() {
        if(Logger.logger)
            Logger.logger.clear();
    }

    static onData(clb:(data)=>void) {
        Logger.listeners.push(clb);
    }

    protected static ping(data: string) {
        for(let i = 0; i < Logger.listeners.length; i++) {
            Logger.listeners[i](data);
        }
    }

    protected abstract info(msg : string) : void;
    protected abstract warn(msg : string) : void;
    protected abstract error(msg : string) : void;
    protected abstract log(msg : string) : void;
    protected abstract clear() : void;

    static close() {
        Logger.logger = null;
    }
}