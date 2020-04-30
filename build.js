const spawn = require('child_process').spawn;
var os = require('os');

var runType = process.argv[2];
if(!runType) {
    throw new Error("No run type given! ex. node build compile");
}
if (os.type() === 'Linux') {
   spawn('npm', ["run",runType+"-linux"], { stdio: 'inherit' });
}
else if (os.type() === 'Darwin')
throw new Error("Mac OS is not supported yet! Sorry: ");
else if (os.type() === 'Windows_NT')
    try {
        spawn('npm.cmd', ["run", runType + "-windows"], {stdio: 'inherit'});
    } catch(err) {
    console.log(err);
    }
else
   throw new Error("Unsupported OS found: " + os.type());
