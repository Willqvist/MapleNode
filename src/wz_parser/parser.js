const WZFile = require("./WZFile");
const ErrorHandler = require("./ErrorHandler");
const fs = require("fs");
const Constants = require("./CryptoConstants");
const WZType = require("./WZType");
const path = require("path");

class Parser
{
    static parse(file_path,callback)
    {
        fs.readFile(file_path,null,(err,buffer)=>
        {
            if(err) throw err;
            Parser.parse_buffer(buffer,path.basename(file_path),callback);
        });
    }
    static parse_file(callback)
    {
        if(Parser.files.length <= 0)
        {
            return;
        }
        let file = Parser.files[0];
        console.log(Parser.files);
        Parser.parse_buffer(file.data,file.name,((res)=>
        {
            Parser.files.shift();
            callback(res);
            this.parse_file();
        }).bind(callback));   
    }
    static parse_buffer(buffer,filename,callback)
    {
        //let err_handler = new ErrorHandler(callback);
        let wzFile = new WZFile(filename,buffer,Constants.versions.GMS);
        if(!wzFile.setType(WZType.getType(filename,callback)))
        {
            return callback({err:{hasError:true,reason:"Something went wrong parsing file, is this a correct .wz file?"}});
        }
        let parsed = wzFile.parse();
        console.log("parsing");
        if(!parsed)
        {
            return callback({err:{hasError:true,reason:"Something went wrong parsing file"}});
        }
        wzFile.wzDir.parseImages();
        console.log("parsed");
        wzFile.saveType();
    }
    static add_to_parse(file,callback)
    {
        Parser.files.push({name:file.name,data:file.data});
        if(Parser.files.length == 1)
        {
            Parser.parse_file(callback);
        }
    }
}
Parser.files = [];
module.exports = Parser;