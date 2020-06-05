import express from 'express';
import MapleCharacterGenerator, { GENERATOR_ERROR } from '../MapleCharacterGenerator/MCG';
import * as constants from '../core/Constants';

const mcg = new MapleCharacterGenerator(60 * 5);
const router = express.Router();
router.get('/characters/*.chr', (req, res) => {
  const realPath = constants.getConstant('realPath');
  const name = req.url.replace('/characters/', '').replace('.chr', '');
  mcg.generatePlayer((playerRes) => {
    if (!playerRes.success) {
      if (playerRes.errorID === GENERATOR_ERROR.INVALID_PLAYER) {
        res.contentType('image/png');
        return res.sendFile('characters/undefined.png', { root: realPath });
      }
    }
    res.contentType('image/png');
    res.sendFile(`Characters/${name}.png`, { root: realPath });
  }, name);
});

router.all('/*', (req, res, next) => {
  if (!constants.getConstant('prefix') || constants.getConstant('setup-status') === -1) return res.redirect('/setup/');
  return next();
});

export default router;
