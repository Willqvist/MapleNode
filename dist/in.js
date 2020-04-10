"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InputListener_1 = __importDefault(require("./src/tools/InputListener"));
const Logger_1 = __importDefault(require("./src/logger/Logger"));
const CmdLogger_1 = __importDefault(require("./src/logger/CmdLogger"));
//tools
const stdIn = getStdinVars();
if (stdIn.logger) {
    Logger_1.default.setLogger(new CmdLogger_1.default());
}
else {
    Logger_1.default.setLogger(new CmdLogger_1.default());
}
stdIn.port = !stdIn.port ? 80 : stdIn.port;
process.stdin.resume();
process.stdin.setEncoding('utf8');
//PROCESS INPUT
process.stdin.on('data', function (text) {
    if (text.charAt(0) == '-') {
        return getInputVariables(text.split(' '));
    }
});
InputListener_1.default.listen("stop", (data) => {
    process.exit(1);
});
InputListener_1.default.listen("ping", (data) => {
    Logger_1.default.log("pong");
});
InputListener_1.default.listen("sql", (data) => {
    let sqlData = data.join(" ");
    /*
    mysql.connection.query(sqlData,(err,result)=>
    {
        if(err)
        {
            Logger.warn("Error in sql command: " + sql);
            return;
        }
    });

     */
});
//INPUT HELPER METHODS
function getStdinVars() {
    let data = { _: [] };
    for (let i = 0; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if (arg.charAt(0) == "-") {
            let a = "";
            if (i + 1 < process.argv.length && process.argv[i + 1].charAt(0) != '-')
                a = process.argv[i + 1];
            if (a.length == 0)
                a = "empty";
            data[arg.substring(1)] = a;
        }
    }
    return data;
}
function getInputVariables(data, start = 0) {
    let variable = data[start].substring(1);
    data.shift();
    let i = start;
    let attribs = data;
    data.forEach(element => {
        if (element.charAt(0) == "-") {
            attribs = attribs.slice(start, i);
            return getInputVariables(data, i);
        }
        i++;
    });
    InputListener_1.default.recive(variable.trim(), attribs);
}
//CLEANUP ON EXIT
function exitHandler(options, exitCode) {
    console.log("-exitting");
    if (options.exit) {
        Logger_1.default.log("exiting process");
        process.exit(1);
    }
}
process.on('exit', (code) => {
    Logger_1.default.log("exiting process: " + code);
});
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
let data = {
    port: stdIn.port
};
exports.default = data;
//# sourceMappingURL=in.js.map