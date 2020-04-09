import DatabaseConnection from "./src/database/DatabaseConnection";
import {MysqlDatabase} from "./src/database/MysqlDatabase";
import {Database} from "./src/database/Database";
const MNHandler = require("../src/tools/MNHandler");
export async function onStart() {
    let exists = await MNHandler.isDatabaseSetup();
    console.log("here!");

    if(exists) {
        let data = await MNHandler.getMysql("./settings/database.MN");
        let result = await DatabaseConnection.createInstance(getDatabase(), data);
    }
}

function getDatabase() : Database {
    return new MysqlDatabase();
}

export function onEnd() {

}