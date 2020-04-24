export default abstract class Logger{
    private static logger : Logger;
    private static listeners : ((data)=>void)[] = [];
    private static listensTo = new Set<string>();

    /**
     * TElls the system what logger to use when typwing Logger.log,Logger.error...
     * @param logger the logger to use
     */
    static setLogger(logger : Logger)
    {
        Logger.listensTo.add("all");
        Logger.logger = logger;
    }

    /**
     * tells the logger what message to print depending on the tag.
     * ex. Logger.listenTo("release") will only print messages in format
     * Logger.log("release",...);
     * @param tag the tag/tags to listen to.
     */
    static listenTo(tag: string | string[]) {
        Logger.listensTo.clear();
        if(tag instanceof Array) {
            let tags = <string[]> tag;
            for(let i = 0; i < tags.length; i++) {
                let t = tags[i];
                Logger.listensTo.add(tags[i]);
            }
        } else {
            Logger.listensTo.add(<string>tag);
        }
    }

    /**
     * logs message to the screen
     * @param tag the tag of the message. see {Logger.listenTO}
     * @param msg the message to print
     */
    static log(tag: string,msg : string)
    {
        if(Logger.logger && (Logger.listensTo.has(tag) || Logger.listensTo.has("all")))
            Logger.logger.log(msg);
    }

    /**
     * logs an error to the screen
     * @param tag the tag of the message. see {Logger.listenTO}
     * @param msg the message to print
     */
    static error(tag: string,msg : string)
    {
        if(Logger.logger && (Logger.listensTo.has(tag) || Logger.listensTo.has("all")))
            Logger.logger.error(msg);
    }

    /**
     * logs a warning to the screen
     * @param tag the tag of the message. see {Logger.listenTO}
     * @param msg the message to print
     */
    static warn(tag: string,msg : string)
    {
        if(Logger.logger && (Logger.listensTo.has(tag) || Logger.listensTo.has("all")))
            Logger.logger.warn(msg);
    }

    /**
     * logs a info to the screen
     * @param tag the tag of the message. see {Logger.listenTO}
     * @param msg the message to print
     */
    static info(tag: string,msg : string)
    {
        if(Logger.logger && (Logger.listensTo.has(tag) || Logger.listensTo.has("all")))
            Logger.logger.info(msg);
    }

    /**
     * clears the logger.
     */
    static clear() {
        if(Logger.logger)
            Logger.logger.clear();
    }

    /**
     * sets up a listener that will listen to when the logger has printed a message.
     * @param clb the listener.
     */
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