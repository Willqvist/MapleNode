import fs from 'fs';
import Logger from '../../core/logger/Logger';
import { PalettesInterface } from '../../core/Interfaces/DatabaseInterfaces';
import HOME from '../../Paths';

export default class CSSGenerator {
  private static readonly errorMsg = `
/* DO NOT EDIT THIS FILE!
 * This file has been generated and edit the css files inside template folder instead!
 */
`;

  static async generateCSS(palette: PalettesInterface): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let i = 0;
      fs.readdir(`${HOME}/templates/CSSTemplates/`, (err, files) => {
        if (err) reject(err);
        files.forEach((file) => {
          fs.readFile(`${HOME}/templates/CSSTemplates/${file}`, 'utf8', (errRead, t) => {
            let text = CSSGenerator.errorMsg + t;
            i++;
            if (err) Logger.error('error', `${errRead}`);
            text = text.replace(/var\(--mainColor\)/g, palette.mainColor);
            text = text.replace(/var\(--secondaryMainColor\)/g, palette.secondaryMainColor);
            text = text.replace(/var\(--fontColorDark\)/g, palette.fontColorDark);
            text = text.replace(/var\(--fontColorLight\)/g, palette.fontColorLight);
            text = text.replace(/var\(--fillColor\)/g, palette.fillColor);
            fs.writeFileSync(`${HOME}/public/CSS/${file}`, text);
            if (i === files.length - 1) {
              resolve();
            }
          });
        });
      });
    });
  }

  static async generateHomeLayout(json: object) {
    return new Promise<void>((resolve) => {
      let html = '';
      Object.keys(json).forEach((key) => {
        const obj = json[key];
        html += `
            <div class="control box ${obj.panel}_box" style="grid-column:${obj.columns.pos}/${obj.columns.size};grid-row:${obj.rows.pos}/${obj.rows.size}">
                <h2 class="box_title">${obj.name}</h2>
                <% include panels/${obj.panel}.ejs %>
            </div>
            `;
      });
      fs.readFile('./scripts/CSSGenerator/HTMLTemplates/index.ejs', 'utf8', (err, file) => {
        if (err) Logger.error('error', err.message);
        file = file.replace(/<!--var\(--content\)-->/g, html);
        fs.writeFile('./views/index.ejs', file, () => {
          resolve();
        });
      });
    });
  }
}
