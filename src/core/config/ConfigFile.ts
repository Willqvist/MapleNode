import {parsePath, pathSetValue} from "./ConfigParser";
import Observer from "../Observer";
import FileTools from "../tools/FileTools";

export default class ConfigWriter {

    private config : any;
    private orgFile : any;
    private paths : {path:string,value:string|number|Object}[] = [];
    constructor(config,org) {
        this.config = config;
        this.orgFile = org;
    }

    public async write(path : string, val: string|number|Object) {
        pathSetValue(this.config,path,val);
        pathSetValue(this.orgFile,path,val);
        await FileTools.write("./nodeconfig.json",JSON.stringify(this.orgFile, null, "\t"));
    }

    async save() {
        for(let key in this.paths) {
            pathSetValue(this.config,this.paths[key].path,this.paths[key].value);
        }
    }


}
