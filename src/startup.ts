import DatabaseConnection from "./core/database/DatabaseConnection";
import {MysqlDatabase} from "./core/database/MysqlDatabase";
import {Database} from "./core/database/Database";
import MNHandler from "./setup/MNHandler";
import Logger from "./core/logger/Logger"

export function getDatabase() : Database {
    return new MysqlDatabase();
}

export function onEnd() {

}
