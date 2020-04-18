export default class Observer {

    //private static observers: {[key:string]:(data: any) => void} = {};
    private static observers : Map<string,((data: any) => void)[]> = new Map();
    private static observable: Set<string> = new Set();

    public static register(name : string) {
        this.observable.add(name);
    }

    public static listen(name: string, callback: (data: any|null) => void) {
        if(!this.observers.has(name)) {
            this.observers.set(name,[]);
        }
        this.observers.get(name).push(callback);
    }

    public static async notify(name: string, data? : any) {
        let observers = this.observers.get(name);
        for(let i in observers) {
            await observers[i](data);
        }
    }

    static exists(name: string) {
        return this.observable.has(name);
    }
}
