"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    static getTime() {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }
}
exports.default = Time;
//# sourceMappingURL=Time.js.map