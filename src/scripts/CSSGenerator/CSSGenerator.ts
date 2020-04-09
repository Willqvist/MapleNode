import fs from 'fs';
import Logger from "../../src/logger/Logger";
import {PaletteInterface} from "../../src/tools/Interfaces";
export default class CSSGenerator
{
    static async generateCSS(palette : PaletteInterface) : Promise<void>
    {
        return new Promise<void>(resolve => {
            let i = 0;
            fs.readdir("./scripts/CSSGenerator/templates/", (err, files) => {
                if (err) Logger.error(err.message);
                files.forEach((file) => {
                    fs.readFile("./scripts/CSSGenerator/templates/" + file, "utf8", ((err, text) => {
                        i++;
                        if (err) Logger.error(err);
                        text = text.replace(/var\(--mainColor\)/g, palette.mainColor);
                        text = text.replace(/var\(--secondaryMainColor\)/g, palette.secondaryMainColor);
                        text = text.replace(/var\(--fontColorDark\)/g, palette.fontColorDark);
                        text = text.replace(/var\(--fontColorLight\)/g, palette.fontColorLight);
                        text = text.replace(/var\(--fillColor\)/g, palette.fillColor);
                        fs.writeFileSync("./public/CSS/" + file, text);
                        if (i == files.length - 1) {
                            resolve();
                        }
                    }).bind(file));
                })
            });
        });
    }
    static async generateHomeLayout(json :object)
    {
        return new Promise<void>(resolve => {
            let html = "";
            Object.keys(json).forEach((key) => {
                let obj = json[key];
                console.log(obj);
                html += `
            <div class="control box ${obj.panel}_box" style="grid-column:${obj.columns.pos}/${obj.columns.size};grid-row:${obj.rows.pos}/${obj.rows.size}">
                <h2 class="box_title">${obj.name}</h2>
                <% include panels/${obj.panel}.ejs %>
            </div>
            `
            });
            fs.readFile("./scripts/CSSGenerator/HTMLTemplates/index.ejs", "utf8", (err, file) => {
                if (err) Logger.error(err.message);
                file = file.replace(/<!--var\(--content\)-->/g, html);
                fs.writeFile("./views/index.ejs", file, ()=> {
                    resolve();
                });
            });
        });
    }
}
let generator = new CSSGenerator();
module.exports = generator; 