import express, { Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import Logger from '../core/logger/Logger';
import CSSGenerator from '../scripts/CSSGenerator/CSSGenerator';
import DatabaseConnection from '../core/database/DatabaseConnection';
import FileTools from '../core/tools/FileTools';
import app from '../App';
import { getAccount, isLoggedIn, isWebAdmin } from '../models/SessionHandler';
import FileProvider from '../models/FileProvider';

const router = express.Router();
const upload = multer({ dest: 'upload/' });

// Helper methods
async function renderGMDashboard(req, res) {
  try {
    const votes = await DatabaseConnection.instance.getVotes();
    const palettes = await DatabaseConnection.instance.getPalettes();
    const downloads = await DatabaseConnection.instance.getDownloads();
    const reports = await DatabaseConnection.instance.getReports();
    const logs = await DatabaseConnection.instance.getLogs();
    const tags = await FileProvider.getAllTags();
    const imageTags = await FileProvider.getTaggedFiles();
    const images = imageTags.filter((val) => FileTools.isImage(val));
    let activePalette = palettes[0].name;
    for (let i = 0; i < palettes.length; i++) {
      if (palettes[i].active === 1) {
        activePalette = palettes[i].name;
        break;
      }
    }
    res.render('pages/dashboardGM', {
      votes,
      downloads,
      palettes: { all: palettes, active: activePalette },
      user: getAccount(req.session),
      images,
      tags,
      reports,
      logs,
    });
  } catch (err) {
    Logger.log('debug', `Error rendering gm dashboard ${err}`);
  }
}

function renderDashboard(req, res) {
  res.render('pages/dashboardUser');
}

function send(res: Response, msg: any, status: number = 200) {
  res.status(status).send(JSON.stringify(msg));
}

router.get('*', (req, res, next) => {
  const { session } = req;
  if (!isLoggedIn(session) || !isWebAdmin(session)) return res.render('pages/dashboardLogin');
  next();
});

router.all('*', (req, res, next) => {
  const { session } = req;
  if (!isLoggedIn(session) || !isWebAdmin(session)) return send(res, { success: false, reason: 'access denied!' }, 403);
  next();
});

router.get('/', (req, res) => {
  const user = getAccount(req.session);
  const gm = Math.max(user.gm, user.webadmin);
  if (gm < 3) return renderDashboard(req, res);
  if (gm >= 3) return renderGMDashboard(req, res);
});

router.put('/vote', async (req, res) => {
  const { name, url, nx, time, key } = req.body;
  try {
    await DatabaseConnection.instance.updateVote(key, name, url, nx, time);
    return send(res, { success: true });
  } catch (err) {
    return send(res, { success: false, reason: err.getMessage() });
  }
});

router.post('/vote', async (req, res) => {
  const { name, nx, time, url } = req.body;

  if (!name || !nx || !time || name.length === 0 || url.length === 0 || nx.length === 0 || time.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    const result = await DatabaseConnection.instance.addVote(name, url, nx, time);
    send(res, { success: true, id: result });
  } catch ({ message }) {
    send(res, { success: false, reason: message });
  }
});

router.delete('/vote', async (req, res) => {
  try {
    const { id } = req.body;
    await DatabaseConnection.instance.deleteVote(id);
    send(res, { success: true });
  } catch ({ message }) {
    send(res, { success: false, reason: message });
  }
});

router.post('/palette', async (req, res) => {
  const { name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor } = req.body;
  if (!name || !mainColor || !secondaryMainColor || !fontColorLight || !fontColorDark || !fillColor) {
    return send(res, { success: false, reason: 'Input may not be empty!' });
  }

  try {
    const paletteId = await DatabaseConnection.instance.addPalette(
      name,
      mainColor,
      secondaryMainColor,
      fontColorDark,
      fontColorLight,
      fillColor,
      0
    );
    return send(res, { success: true, key: paletteId });
  } catch (err) {
    send(res, { success: false, reason: err.getMessage() });
  }
});

router.post('/palette/select', async (req, res) => {
  const { key } = req.body;
  try {
    const palette = await DatabaseConnection.instance.enablePalette(key);
    await CSSGenerator.generateCSS(palette);
    send(res, { success: true });
  } catch (err) {
    send(res, { success: true, reason: err.getMessage() });
  }
});

router.delete('/palette', async (req, res) => {
  const { key } = req.body;
  if (!key) {
    return send(res, { success: false, reason: 'Key may not be empty!' });
  }
  try {
    await DatabaseConnection.instance.deletePalette(key);
    return send(res, { success: true });
  } catch ({ message }) {
    send(res, { success: true, reason: message });
  }
});

router.put('/palette', async (req, res) => {
  const { key, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor } = req.body;
  if (!key || !mainColor || !secondaryMainColor || !fontColorLight || !fontColorDark || !fillColor) {
    return send(res, { success: false, reason: 'Input may not be empty!' });
  }

  try {
    await DatabaseConnection.instance.updatePalette(
      key,
      mainColor,
      secondaryMainColor,
      fontColorDark,
      fontColorLight,
      fillColor
    );
    return send(res, { success: true });
  } catch (err) {
    send(res, { success: false, reason: err.getMessage() });
  }
});

router.put('/file', upload.single('file'), async (req, res) => {
  const { file } = req;
  try {
    await FileProvider.moveFile(file.path, file.originalname);
  } catch (err) {
    let msg = err.getMessage();
    if (err.getErrorCode() === 1062) msg = `${file.originalname} already exists!`;
    return send(res, { success: true, reason: msg });
  }
  send(res, { success: true });
});

router.put('/file/tag', upload.single('file'), async (req, res) => {
  const { file, tag } = req.body;
  if (!file || !tag) {
    return send(res, { success: true, reason: 'tag or file may not be empty' });
  }
  try {
    await FileProvider.tagFile(file, tag);
    app.getApp().locals[tag] = (await FileProvider.getTaggedFile(tag)).destName;
  } catch (err) {
    return send(res, { success: true, reason: err.getMessage() });
  }
  send(res, { success: true });
});

router.delete('/file/tag', upload.single('file'), async (req, res) => {
  const { file, tag } = req.body;
  if (!file || !tag) {
    return send(res, { success: true, reason: 'tag or file may not be empty' });
  }
  try {
    await FileProvider.removeTag(file, tag);
    app.getApp().locals[tag] = (await FileProvider.getTaggedFile(tag)).destName;
  } catch (err) {
    return send(res, { success: true, reason: err.getMessage() });
  }
  send(res, { success: true });
});

router.delete('/file', async (req, res) => {
  const { file } = req.body;
  try {
    await FileProvider.deleteFile(file);
  } catch (err) {
    return send(res, { success: true, reason: err.getMessage() });
  }
  send(res, { success: true });
});

router.post('/logo/change', async (req, res) => {
  const { file } = req.body;
  try {
    await DatabaseConnection.instance.tagFile(file, 'logo');
    app.getApp().locals.logo = file;
    return send(res, { success: true });
  } catch ({ message }) {
    send(res, { success: true, reason: message });
  }
});

router.put('/download', async (req, res) => {
  const { name, url, key } = req.body;
  if (!name || !url || name.length === 0 || url.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    await DatabaseConnection.instance.updateDownload(key, name, url);
    return send(res, { success: true });
  } catch (err) {
    send(res, { success: true, reason: err.getMessage() });
  }
});

router.put('/download/image', async (req, res) => {
  const { id, image } = req.body;
  if (!image || image.length === 0 || !id || id.length === 0) {
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);
  }

  try {
    await DatabaseConnection.instance.setDownloadImage(id, image);
    return send(res, { success: true });
  } catch (err) {
    send(res, { success: true, reason: err.getMessage() });
  }
});

router.delete('/download', async (req, res) => {
  const { id } = req.body;
  if (!id) return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    await DatabaseConnection.instance.deleteDownload(id);
    return send(res, { success: true });
  } catch ({ message }) {
    send(res, { success: true, reason: message });
  }
});

router.post('/download', async (req, res) => {
  const { name, url, image } = req.body;
  if (!name || !url || !image || image.length === 0 || name.length === 0 || url.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    const id = await DatabaseConnection.instance.addDownload(name, image);
    await DatabaseConnection.instance.addDownloadMirror(id, url);
    return send(res, { success: true, id });
  } catch ({ message }) {
    send(res, { success: true, reason: message });
  }
});

router.delete('/download/mirror', async (req, res) => {
  const { id, url } = req.body;
  if (!id || !url || id.length === 0 || url.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    await DatabaseConnection.instance.removeDownloadMirror(id, url);
    return send(res, { success: true, id });
  } catch ({ message }) {
    send(res, { success: true, reason: message });
  }
});

router.put('/download/mirror', async (req, res) => {
  const { id, url } = req.body;
  if (!id || !url || id.length === 0 || url.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);

  try {
    await DatabaseConnection.instance.addDownloadMirror(id, url);
    return send(res, { success: true, id });
  } catch (err) {
    send(res, { success: true, reason: err.getMessage() });
  }
});

router.get('/layout/:name', async (req, res) => {
  const { name } = req.params;

  if (!name || name.length === 0) return send(res, { success: false, reason: 'Input may not be empty!' }, 406);
  try {
    const layout = await DatabaseConnection.instance.getLayout(name);
    fs.readdir('./views/panels/', (err, files) => {
      if (err) Logger.error('debug', err.message);
      res.send(JSON.stringify({ success: true, json: layout, content: files }));
    });
  } catch ({ message }) {
    return send(res, { success: false, reason: message });
  }
});

router.post('/layout', async (req, res) => {
  const { json, name } = req.body;
  if (json.length === 0 || name.length === 0)
    return send(res, { success: false, reason: 'Input may not be empty!' }, 406);
  try {
    await DatabaseConnection.instance.updateLayout(name, json);
    await CSSGenerator.generateHomeLayout(JSON.parse(json));
    return send(res, { success: true });
  } catch ({ message }) {
    return send(res, { success: false, reason: message });
  }
});

export default router;
