const fs = require('fs');
const parse = require('xml-parser');
class FileLoader
{
    parseXML(file)
    {
        let fileRet = fs.readFileSync(file,'utf8');
        return parse(fileRet);
    }
}
module.exports = FileLoader;