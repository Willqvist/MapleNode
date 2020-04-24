import Errno from "../tools/Errno";
import {HOME} from "../../Paths";
import Logger from "../logger/Logger";

export function parsePath(root:any, val : string,settings={build:false,parent:false}) {
    if(!val) return root;
    let path = val.split('/');
    let obj = root;
    let parent = root;
    for(let i in path) {
        parent = obj;
        obj = obj[path[i]];
        if(obj == null) {
            if(settings.build) {
                parent[path[i]] = {};
            } else {
                Logger.error("error",`No path "${path[i]}" found in ${val}`);
                return null;
            }
        }
    }
    return settings.parent ? parent : obj;
}

export function pathSetValue(root:any, path : string,value: any) {
    let last = path.substring(path.lastIndexOf('/')+1);
    let obj = parsePath(root,path,{build: true,parent: true});
    obj[last] = value;
}

export class ConfigMember{

    private readonly root : any;

    constructor(root) {
        this.root = root;
    }

    interface<T>(path?: string) : T {
        return <T>parsePath(this.root,path);
    }

    string(path?: string) : string {
        return parsePath(this.root,path);
    }
    number(path?: string) : number {
        return parsePath(this.root,path);
    }

    boolean(path?: string) : boolean {
        return parsePath(this.root,path);
    }

    async import<T>(val? : string,path? : string) : Promise<T> {
        let rlPath = "";
        if(path) {
            rlPath = path;
        }
        return <T>new (await import(`../../${path}${parsePath(this.root,val)}`)).default();
    }

    member(val : string) : ConfigMember {
        return new ConfigMember(parsePath(this.root,val));
    }

}


export default class ConfigParser extends ConfigMember{
    constructor(root) {
        super(root);
    }
}
