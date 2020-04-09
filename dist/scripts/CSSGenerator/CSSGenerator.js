"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Logger_1 = __importDefault(require("../../src/logger/Logger"));
class CSSGenerator {
    static generateCSS(palette) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let i = 0;
                fs_1.default.readdir("./scripts/CSSGenerator/templates/", (err, files) => {
                    if (err)
                        Logger_1.default.error(err.message);
                    files.forEach((file) => {
                        fs_1.default.readFile("./scripts/CSSGenerator/templates/" + file, "utf8", ((err, text) => {
                            i++;
                            if (err)
                                Logger_1.default.error(err);
                            text = text.replace(/var\(--mainColor\)/g, palette.mainColor);
                            text = text.replace(/var\(--secondaryMainColor\)/g, palette.secondaryMainColor);
                            text = text.replace(/var\(--fontColorDark\)/g, palette.fontColorDark);
                            text = text.replace(/var\(--fontColorLight\)/g, palette.fontColorLight);
                            text = text.replace(/var\(--fillColor\)/g, palette.fillColor);
                            fs_1.default.writeFileSync("./public/CSS/" + file, text);
                            if (i == files.length - 1) {
                                resolve();
                            }
                        }).bind(file));
                    });
                });
            });
        });
    }
    static generateHomeLayout(json) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let html = "";
                Object.keys(json).forEach((key) => {
                    let obj = json[key];
                    console.log(obj);
                    html += `
            <div class="control box ${obj.panel}_box" style="grid-column:${obj.columns.pos}/${obj.columns.size};grid-row:${obj.rows.pos}/${obj.rows.size}">
                <h2 class="box_title">${obj.name}</h2>
                <% include panels/${obj.panel}.ejs %>
            </div>
            `;
                });
                fs_1.default.readFile("./scripts/CSSGenerator/HTMLTemplates/index.ejs", "utf8", (err, file) => {
                    if (err)
                        Logger_1.default.error(err.message);
                    file = file.replace(/<!--var\(--content\)-->/g, html);
                    fs_1.default.writeFile("./views/index.ejs", file, () => {
                        resolve();
                    });
                });
            });
        });
    }
}
exports.default = CSSGenerator;
let generator = new CSSGenerator();
module.exports = generator;
//# sourceMappingURL=CSSGenerator.js.map