import InputListener from "./src/tools/InputListener";
import Logger from "./src/logger/Logger";
import CmdLogger from "./src/logger/CmdLogger";

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

//PROCESS INPUT
process.stdin.on('data', function (text : string) {

    if(text.charAt(0) == '-')
    {
        return getInputVariables(text.split(' '));
    }
});

InputListener.listen("stop",(data)=>
{
    process.exit(1);
});

InputListener.listen("ping",(data)=>
{
    Logger.log("pong");
});
InputListener.listen("sql",(data)=>
{
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

function getInputVariables(data,start=0)
{
    let variable = data[start].substring(1);
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

    InputListener.recive(variable.trim(),attribs);
}






//CLEANUP ON EXIT
function exitHandler(options, exitCode) {
    if (options.exit)
    {
        process.exit(1);
    }
}

process.on('exit', (code)=>
{
});
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
let data = {
    port : stdIn.port
};
export default data;