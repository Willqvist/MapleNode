import express from 'express';
import fs from 'fs';
import multer from 'multer';
import * as constants from '../core/Constants';
// import * as lib  from "../core/library/Library";
import parser from '../core/wz_parser/parser';
import FileTools from '../core/tools/FileTools';

const router = express.Router();

multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

multer({
  limits: {
    fileSize: 1000000 * 1000,
  },
});

router.all(['/', '/index', '/start'], (req, res, next) => {
  return res.render('library/index', { path: constants.getConstant('realPath'), error: false });
});

// SEARCH
router.get('/search', (req, res, next) => {
  return res.render('library/index', {
    path: constants.getConstant('realPath'),
    error: true,
    errorReason: 'No search keyword given!',
  });
});

/*
router.post('/search', (req, res) => {
  library.getAll(req.body.search, (data) => {
    return res.send(JSON.stringify(data));
  });
});
*/

// UPLOAD
router.get('/upload', (req, res) => {
  return res.render('library/upload');
});

// UPLOAD POST
const uploadSettings = {
  uploadedString: false,
  loadedString: null,
};
let buffers = [];
let file_uid = -1;
router.post('/upload/:uid/file', (req, res) => {
  const uid = parseInt(req.params.uid, 10);
  if (uid !== file_uid) {
    file_uid = uid;
    buffers = [];
  }
  buffers.push(Buffer.from(req.body.file, 'binary'));
  return res.send('!');
});
router.post('/upload/:name/:uid', (req, res) => {
  const buffer = Buffer.concat(buffers);
  const file = { originalname: req.params.name, buffer };
  if (file.originalname !== 'String.wz' && !uploadSettings.loadedString) {
    return res.send(JSON.stringify({ error: 'Upload String.wz first!', uid: req.params.uid }));
  }

  parser.add_to_parse({ name: file.originalname, data: file.buffer }, (result) => {
    if (result.err.hasError)
      if (result.err.reason) return res.send(JSON.stringify({ error: result.err.reason, uid: req.params.uid }));
      else return res.send(JSON.stringify({ error: `Error parsing ${file.originalname}`, uid: req.params.uid }));

    uploadSettings.loadedString = true;
    return res.send(JSON.stringify({ success: true, uid: req.params.uid }));
  });
});

router.get('/:type/:id', (req, res) => {
  //const { id } = req.params;
  const { type } = req.params;
  if (!constants.getConstant('type_mapper')[type]) return res.send('hmm');
  /*
  library.getData({ id, type }, (data) => {
    return res.render(`library/render-type/type-${data.type}`, { data });
  });
   */
});

router.get('/:id.:type.:ext', async (req, res) => {
  const realPath = constants.getConstant('realPath');
  switch (req.params.ext) {
    case 'img': {
      const type = constants.getConstant('type_mapper')[req.params.type];
      const path = `/library/v62/${type}/${req.params.id}/${constants.getConstant('icon_mapper')[type]}.png`;
      const exists = await FileTools.exists(realPath + path);
      res.contentType('image/png');
      if (exists) return res.sendFile(path, { root: realPath });
      return res.sendFile('/library/undefined.png', { root: realPath });
    }
    default:
      break;
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (id.length !== 8 || !id) return res.send('hmm');
  /*
  library.getData({ id }, (data) => {
    return res.render(`library/render-type/type-${data.type}`, { data });
  });
  */
});

module.exports = router;
