import {Database} from "../database/Database";
import Logger from "../logger/Logger";
import ConfigParser from "./ConfigParser";
import {DatabaseAuthInterface} from "../Interfaces/Interfaces";
import ConfigFile from "./ConfigFile";
import FileTools from "../tools/FileTools";


export interface ConfigInterface {
    server: {
        database: {
            instance: Database,
            auth: DatabaseAuthInterface,
            prefix: string
        },
        port: number,
    }
    run:RunInterface
}
export interface RunInterface {
    mode: string,
    showError : boolean
}

let config : ConfigInterface;
export let configParser : ConfigParser;
let configFile : ConfigFile;

export async function getConfig() : Promise<ConfigInterface> {
    if(config !=null) return config;

    let file = JSON.parse(await FileTools.readFile("./nodeconfig.json","utf8"));

    config = new class implements ConfigInterface {
        server: {
            database: {
                instance: Database,
                auth: DatabaseAuthInterface,
                prefix: string
            };
            port: number;
        } = {database:null,port:0};
        run: RunInterface;
    };
    configParser = new ConfigParser(file);
    await applyParsers(configParser);
    configFile = new ConfigFile(config,file);
    return config;
}


export async function openConfig(): Promise<ConfigFile> {
    if(!config) await getConfig();
    return configFile;
}


async function applyParsers(obj : ConfigParser) {

    let database = obj.member("server/database");
    try {
        const db = await database.import<Database>("instance","core/database/mysql/");
        let auth = await database.interface<DatabaseAuthInterface>("auth");
        config.server.database = {
            instance:db,
            auth:auth,
            prefix:"",
        };
    } catch(err) {
        Logger.error(err.message);
    }

    config.run = await obj.interface<RunInterface>("run");
    config.server.port = await obj.number("server/port");
    config.server.database.prefix = await obj.string("server/database/prefix");

}
