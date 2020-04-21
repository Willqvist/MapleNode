var exec = require('child_process').exec;
function puts(error, stdout, stderr) {
   if (error) {
      console.log(error.message);
      return;
  }
  if (stderr) {
      console.log(stderr);
      return;
  }
  console.log(stdout); 
   }

var os = require('os');
var runType = process.argv[2];
if(!runType) {
    throw new Error("No run type given! ex. node build compile");
}
if (os.type() === 'Linux') {
   exec("npm run "+runType+"-linux", puts); 
}
else if (os.type() === 'Darwin') 
throw new Error("Mac OS is not supported yet! Sorry: ");
else if (os.type() === 'Windows_NT') 
   exec("npm run "+runType+"-windows", puts);
else
   throw new Error("Unsupported OS found: " + os.type());