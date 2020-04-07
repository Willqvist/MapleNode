class DatabaseConnection {

    static async createInstance(database,data) {
        DatabaseConnection.instance = database;
        let connected = await database.onInstansiate(data);
        console.log("here",connected);
        DatabaseConnection.connected = connected;
        return connected;
    }

    static getInstance() {
        return DatabaseConnection.instance;
    }

    static isConnected() {
        return DatabaseConnection.connected;
    }

}

module.exports = DatabaseConnection;