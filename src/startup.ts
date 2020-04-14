import DatabaseConnection from "./src/database/DatabaseConnection";
import {MysqlDatabase} from "./src/database/MysqlDatabase";
import {Database} from "./src/database/Database";
import MNHandler from "./src/tools/MNHandler";
import Logger from "./src/logger/Logger"

export function getDatabase() : Database {
    return new MysqlDatabase();
}

export function onEnd() {

}