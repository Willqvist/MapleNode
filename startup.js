const DatabaseConnection = require("./src/database/DatabaseConnection");
const MysqlDatabase = require("./src/database/MysqlDatabase");
const MNHandler = require("./src/tools/MNHandler");
async function onStart() {
    let exists = await MNHandler.isDatabaseSetup();
    console.log("here!");

    if(exists) {
        let data = await MNHandler.getMysql("./settings/database.MN");
        let result = await DatabaseConnection.createInstance(getDatabase(), data);
    }
}

function getDatabase() {
    return new MysqlDatabase();
}

function onEnd() {

}

module.exports = {
    onStart: onStart,
    onEnd: onEnd,
    getDatabase:getDatabase
}