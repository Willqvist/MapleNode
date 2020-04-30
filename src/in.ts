import InputListener from "./core/tools/InputListener";
import Logger from "./core/logger/Logger";
import CmdLogger from "./core/logger/CmdLogger";
import Observer from "./core/Observer";
import {getConfig} from "./core/config/Config";
process.stdout.write("MapleNode> ");
//tools
const stdIn = getStdinVars();
if(stdIn.logger)
{
    Logger.setLogger(new CmdLogger());
} else {
    Logger.setLogger(new CmdLogger());
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

Logger.onData(()=> {
    process.stdout.write("MapleNode> ");
});

//PROCESS INPUT
process.stdin.on('data', function (text : string) {
    let processed : boolean = getInputVariables(text.split(' '));
});

InputListener.listen(["stop","quit","exit","!q"],(data)=>
{
    Logger.close();
    process.exit(0);
});

InputListener.listen("ping",(data)=>
{
    Logger.log("release","pong");
});

InputListener.listen(["help","!h"],(data)=>
{
    Logger.log("release",`
    \x1b[1mCommands\x1b[0m
    \x1b[1mhelp, !h\x1b[0m:                      Lists all commands
    \x1b[1mquit, stop, exit, !q, ^C\x1b[0m:      Stops the server
    \x1b[1mping\x1b[0m:                          pong
    `);
});


//INPUT HELPER METHODS
function getStdinVars() : any
{
    let data = {_:[]};
    for (let i = 0; i < process.argv.length; i++) {
        let arg = process.argv[i];
        if(arg.charAt(0) == "-")
        {
            let a = "";
            if(i+1 < process.argv.length && process.argv[i+1].charAt(0) != '-')
                a = process.argv[i+1];
            if(a.length == 0) a = "empty";
            data[arg.substring(1)] = a;
        }
    }
    return data;
}

function getInputVariables(data,start=0) : boolean
{
    let sub = data[0].substring(0,data[0].length-1);

    //if windows, remove \r
    if(sub.charAt(sub.length-1) == '\r') sub = sub.substring(0,sub.length-1);

    let recieved : boolean = InputListener.recive(sub, {});
    if(!recieved) {
        process.stdout.write("MapleNode> ");
    }

    return true;
}



Observer.register("EXIT");


//CLEANUP ON EXIT
function exitHandler(options, exitCode) {
    if (options.exit)
    {
        process.exit(1);
    }
}

process.on('exit', async (code)=>
{
    await Observer.notify("EXIT");
});
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
let data = {
    port : stdIn.port
};
export default data;
