const fs = require('fs');
const Logger = require("../../src/logger/Logger");
class CSSGenerator
{
    generateCSS(mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,callback)
    {
        let i = 0;
        fs.readdir("./scripts/CSSGenerator/templates/",(err,files)=>
        {
            if(err) Logger.error(err);
            files.forEach((file)=>
            {
                fs.readFile("./scripts/CSSGenerator/templates/"+file,"utf8",((err,text)=>
                {
                    i++;
                    if(err) Logger.error(err);
                    text = text.replace(/var\(--mainColor\)/g,mainColor); 
                    text = text.replace(/var\(--secondaryMainColor\)/g,secondaryMainColor); 
                    text = text.replace(/var\(--fontColorDark\)/g,fontColorDark); 
                    text = text.replace(/var\(--fontColorLight\)/g,fontColorLight); 
                    text = text.replace(/var\(--fillColor\)/g,fillColor); 
                    fs.writeFileSync("./public/CSS/"+file,text);
                    if(i == files.length-1)
                    {
                        callback();
                    }
                }).bind(file));
            })
        });
    }
    generateHomeLayout(json)
    {
        let html = "";
        Object.keys(json).forEach((key)=>
        {
            let obj = json[key];
            console.log(obj);
            html += `
            <div class="control box ${obj.panel}_box" style="grid-column:${obj.columns.pos}/${obj.columns.size};grid-row:${obj.rows.pos}/${obj.rows.size}">
                <h2 class="box_title">${obj.name}</h2>
                <% include panels/${obj.panel}.ejs %>
            </div>
            `
        });
        fs.readFile("./scripts/CSSGenerator/HTMLTemplates/index.ejs","utf8",(err,file)=>
        {
            if(err) Logger.error(err);
            file = file.replace(/<!--var\(--content\)-->/g,html);
            fs.writeFileSync("./views/index.ejs",file); 
        });
    }
}
let generator = new CSSGenerator();
module.exports = generator; 