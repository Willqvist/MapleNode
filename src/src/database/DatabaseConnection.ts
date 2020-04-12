import {Database} from "./Database";
import Errno from "../tools/Errno";
export default class DatabaseConnection {

    static instance : Database;
    static connected : boolean;
    static async createInstance(database : Database,data : object) : Promise<boolean> {
        DatabaseConnection.instance = database;
        let connected = await database.onInstansiate(data);
        DatabaseConnection.connected = connected;
        return connected;
    }

    static getInstance() : Database {
        return DatabaseConnection.instance;
    }

    static isConnected() : boolean {
        return DatabaseConnection.connected;
    }

}