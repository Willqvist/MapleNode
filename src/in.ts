import InputListener from "./core/tools/InputListener";
import Logger from "./core/logger/Logger";
import CmdLogger from "./core/logger/CmdLogger";
import Observer from "./core/Observer";
process.stdout.write("MapleNode> ");
//tools
const stdIn = getStdinVars();
if(stdIn.logger)
{
    Logger.setLogger(new CmdLogger());
} else {
    Logger.setLogger(new CmdLogger());
}
stdIn.port = !stdIn.port ? 80 : stdIn.port;

process.stdin.resume();
process.stdin.setEncoding('utf8');

Logger.onData(()=> {
    process.stdout.write("MapleNode> ");
})

//PROCESS INPUT
process.stdin.on('data', function (text : string) {

    let processed : boolean = getInputVariables(text.split(' '));
    //if(!processed)
        //process.stdout.write("MapleNode> ");
});

InputListener.listen(["stop","quit"],(data)=>
{
    process.exit(1);
});

InputListener.listen("ping",(data)=>
{
    Logger.log("pong");
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
    process.stdout.write("MapleNode> ");
    /*
    data.shift();
    let i = start;
    let attribs = data;
    data.forEach(element => {
        if(element.charAt(0) == "-")
        {
            attribs = attribs.slice(start,i);
            return getInputVariables(data,i);
        }
        i++;
    });
    */
    InputListener.recive(data[0].substring(0,data[0].length-1), {});


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
