"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseConnection {
    static createInstance(database, data) {
        return __awaiter(this, void 0, void 0, function* () {
            DatabaseConnection.instance = database;
            let connected = yield database.onInstansiate(data);
            console.log("here", connected);
            DatabaseConnection.connected = connected;
            return connected;
        });
    }
    static getInstance() {
        return DatabaseConnection.instance;
    }
    static isConnected() {
        return DatabaseConnection.connected;
    }
}
exports.default = DatabaseConnection;
//# sourceMappingURL=DatabaseConnection.js.map