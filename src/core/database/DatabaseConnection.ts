import { Database } from './Database';
import { DatabaseAuthInterface } from '../Interfaces/Interfaces';

export default class DatabaseConnection {
  private static inst: Database;

  static connected: boolean;

  static async createInstance(database: Database, data: DatabaseAuthInterface): Promise<boolean> {
    DatabaseConnection.inst = database;
    const connected = await database.onInstansiate(data);
    DatabaseConnection.connected = connected;
    return connected;
  }

  static get instance() {
    return DatabaseConnection.inst;
  }

  static getInstance(): Database {
    return DatabaseConnection.inst;
  }

  static isConnected(): boolean {
    return DatabaseConnection.connected;
  }
}
