import express, {Response} from "express";
import * as constants from "../core/Constants";
import fs from "fs";
import Logger from "../core/logger/Logger";
import CSSGenerator from "../scripts/CSSGenerator/CSSGenerator";
import IO from "../models/IO";
import DatabaseConnection from "../core/database/DatabaseConnection";
import FileTools from "../core/tools/FileTools";

const router = express.Router();
let app;
const io = new IO();

router.get("/",(req,res)=>
{
    if(!io.isLoggedIn(req)) return res.render("pages/dashboardLogin");
    let user = io.getAccount(req.session);
    if(user.gm == 0)
        return renderDashboard(req,res);
    else if(user.gm >= 1)
        return renderGMDashboard(req,res);
});

router.post("*", (req, res, next) => {
    const { session } = req;
    if(!io.isLoggedIn(session) || !io.isWebAdmin(session))
        return send(res, { success: false, reason: "access denied" }, 403);
    next();
});

router.post("/vote/update",async (req,res)=>
{
    const { name, url, nx, time, key } = req.body;
    try {
        const result = await DatabaseConnection.instance.updateVote(key, name, url, nx, time);
        return send(res, { success: true });
    } catch({ message }) {
        return send(res, { success: false,reason: message });
    }
});

router.post("/vote/add",async (req,res)=>
{
    const { name, nx, time, url } = req.body;

    if(!name || !nx || !time || name.length == 0 || url.length == 0 || nx.length == 0 || time.length == 0)
        return send(res, { success:false, reason:"Input may not be empty!" }, 406);

    try {
        const result = await DatabaseConnection.instance.addVote(name, url, nx, time);
        send(res, {success:true,id:result});
    } catch({ message }) {
        send(res, { success: false, reason: message });
    }
});

router.post("/vote/remove",async (req,res)=>
{
    try {
        const { id } = req.body;
        const removed = await DatabaseConnection.instance.removeVote(id);
        send(res, { success: true });
    } catch({ message }) {
        send(res, { success: false, reason: message });
    }
});

router.post("/palette/add",async (req,res)=>
{
    const { name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor } = req.body;
    try {
        const paletteId = await DatabaseConnection.instance.addPalette(name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor, 0);
        return send(res, { success: true, key: paletteId });
    } catch({ message }) {
        send(res, {success: false, reason: message});
    }
});
router.post("/palette/select",async (req,res)=>
{
    const { key } = req.body;
    try {
        let palette = await DatabaseConnection.instance.enablePalette(key);
        await CSSGenerator.generateCSS(palette);
        return res.send(JSON.stringify({success: true}));
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});
router.post("/palette/remove",async (req,res)=>
{
    const { key } = req.body;
    try {
    const result = await DatabaseConnection.instance.deletePalette(key);
    return send(res, { success: true });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});
router.post("/palette/update",async (req,res)=>
{

    const { key, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor } = req.body;
    try {
        await DatabaseConnection.instance.updatePalette(key, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor, 0);
        return send(res, { success: true });
    } catch({ message }) {
        send(res, {success: false, reason: message});
    }
});
router.post("/changeImage",async (req,res)=>
{
    let filePaths = (await FileTools.readDir('./public/images/')).map( file => `./public/images/${file.fileName}`);
    return res.send(JSON.stringify({ success: true, files: filePaths }));
});

router.post("/heroImage/change",async (req,res)=>
{
    const { file } = req.body;
    try {
    const result = DatabaseConnection.instance.updateHeroImage(file);
    app.locals.heroImage = file;
    return send(res, { success: true });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});

router.post("/logo/change",(req,res)=>
{
    const { file } = req.body;
    try {
        const result = DatabaseConnection.instance.updateLogo(file);
        app.locals.logo = file;
        return send(res, { success: true });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});

router.post("/download/update",async (req,res)=>
{
    const { name, url, key } = req.body;
    if(!name || !url || (name.length == 0 || url.length == 0))
        return send(res, { success: false, reason: "Input may not be empty!" }, 406);

    try {
        const result = await DatabaseConnection.instance.updateDownload(key, name, url);
        return send(res, { success: true });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});

router.post("/download/remove",async (req,res)=>
{
    const { id } = req.body;
    if(!id)
        return send(res, { success: false, reason: "Input may not be empty!" }, 406);

    try {
        const result = await DatabaseConnection.instance.deleteDownload(id);
        return send(res, { success: true });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }

});

router.post("/download/add",async (req,res)=>
{
    const { name, url, key } = req.body;
    if(!name || !url || (name.length == 0 || url.length == 0))
        return send(res, { success: false, reason: "Input may not be empty!" }, 406);

    try {
        const id = await DatabaseConnection.instance.addDownload(name, url);
        return send(res, { success: true, id });
    } catch({ message }) {
        send(res, { success: true, reason: message });
    }
});

router.get("/layout/:name",async (req,res)=>
{
    const { name } = req.params;

    if(!name || name.length == 0)
        return send(res, { success: false, reason: "Input may not be empty!" }, 406);
    try {
        const layout = await DatabaseConnection.instance.getLayout(name);
        fs.readdir("./views/panels/",(err,files)=>
        {
            if(err) Logger.error("debug", err.message);
            res.send(JSON.stringify({ success: true, json: layout, content: files }));
        });
    } catch({ message }) {
        return send(res, { success:false, reason: message });
    }
});

router.post("/layout",async (req,res)=>
{
    const { json, name } = req.body;
    if(json.length == 0 || name.length == 0)
        return send(res, { success: false, reason: "Input may not be empty!" }, 406);
    try {
        const result = await DatabaseConnection.instance.updateLayout(name, json);
        await CSSGenerator.generateHomeLayout(JSON.parse(json));
        return send(res, { success: true });
    } catch({ message }) {
        return send(res, { success: false, reason: message });
    }
});
function getUser(req)
{
    return req.session.user;
}

async function renderGMDashboard(req,res)
{
    try {
        const votes = await DatabaseConnection.instance.getVotes();
        const palettes = await DatabaseConnection.instance.getPalettes();
        const downloads = await DatabaseConnection.instance.getDownloads();
        let activePalette = palettes[0];
        for(let i = 0; i < palettes.length; i++)
        {
            if(palettes[i].active == 1){
                activePalette = palettes[i];
                break;
            }
        }
        res.render("pages/dashboardGM",{ votes: votes, downloads: downloads, palettes: { all: palettes,active: activePalette }, user: io.getAccount(req.session) });
    } catch({ message }) {
        Logger.log("debug","Error rendering gm dashboard " + message);
    }
}

function readDir(dir,callback)
{
    fs.readdir(dir,(err,files)=>{if(err) throw err; callback(files);});
}

function renderDashboard(req,res)
{
    res.render("pages/dashboardUser");
}

function send(res: Response, msg: any, status: number = 404) {
    res.status(status).send(JSON.stringify(msg));
}

module.exports = function(applet)
{
    app = applet;
    return router;
};
