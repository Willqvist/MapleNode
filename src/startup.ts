import DatabaseConnection from "./src/database/DatabaseConnection";
import {MysqlDatabase} from "./src/database/MysqlDatabase";
import {Database} from "./src/database/Database";
import MNHandler from "./src/tools/MNHandler";
import Logger from "./src/logger/Logger"
export async function onStart() : Promise<boolean> {
    let exists = await MNHandler.isDatabaseSetup();

    if(exists) {
        try {
            let data = await MNHandler.getMysql("./settings/database.MN");
            let result = await DatabaseConnection.createInstance(getDatabase(), data);
        }
        catch(err) {
            Logger.warn("Could not connected to database.");
            Logger.error(`[${err.errno}] ${err.msg}`);
            return false;
        }
    }
    return true;
}

export function getDatabase() : Database {
    return new MysqlDatabase();
}

export function onEnd() {

}