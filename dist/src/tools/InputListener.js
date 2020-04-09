"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InputListener {
    constructor() {
        this.listeners = {};
    }
    static listen(name, cb) {
        this.instance.listen(name, cb);
    }
    static recive(name, data) {
        this.instance.recive(name, data);
    }
    listen(name, cb) {
        if (!this.listeners[name])
            this.listeners[name] = [];
        this.listeners[name].push(cb);
    }
    recive(name, data) {
        if (!this.listeners[name])
            return;
        for (let i = 0; i < this.listeners[name].length; i++)
            this.listeners[name][i](data);
    }
}
exports.default = InputListener;
InputListener.instance = new InputListener();
//# sourceMappingURL=InputListener.js.map