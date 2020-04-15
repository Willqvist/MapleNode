import {Database} from "./database/Database";
import * as file from "../config.json";
import Logger from "./logger/Logger";
export interface Config {
    database : Database,
    port: number,
}

export async function getConfig() : Promise<Config> {
    let impDatabase;
    try {
        impDatabase = await import(`./database/${file.database}`);
    } catch(err) {
        Logger.error(`[CONFIG] Error in config.json, Could not find database: ${file.database}`)
        process.exit(0);
    }
    const Database = impDatabase.default;
    return {database: new Database(), port: file.port};
}
