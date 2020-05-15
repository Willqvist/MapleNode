import express from 'express';
import multer from 'multer';
import md5 from 'md5';
import * as constants from '../core/Constants';
import { PalettesInterface, SettingsInterface } from '../core/Interfaces/DatabaseInterfaces';
import app from '../App';
import Setup from '../models/Setup';
import { getConfig } from '../core/config/Config';
import IO from '../models/IO';
import DatabaseConnection from '../core/database/DatabaseConnection';
import { DatabaseAuthInterface, File } from '../core/Interfaces/Interfaces';
import { getAccount } from '../models/SessionHandler';

const router = express.Router();
const setup = new Setup();
const io = new IO();
const upload = multer({ dest: 'upload/' });

// Helper functions
async function isAllowed(req, res) {
  const { mysqlSetupComplete, settingsComplete } = await setup.setupData();
  if (!mysqlSetupComplete) {
    res.redirect('1');
    return [true, false];
  }
  if (!settingsComplete) {
    res.redirect('2');
    return [false, true];
  }
  return [true, true];
}

router.all('*', async (req, res, next) => {
  const data = await setup.setupData();
  if (data.done) return res.status(403).send('403 - access denied');
  return next();
});

// DESIGN
router.get('/design', async (req, res) => {
  const [mysql, sett] = await isAllowed(req, res);
  if (!mysql || !sett) return;
  const settings = constants.getConstant<SettingsInterface>('settings');
  res.render('setup/setup_logo', { name: settings.serverName });
});

router.post(
  '/design',
  upload.fields([
    { name: 'logoUpload', maxCount: 1 },
    { name: 'heroUpload', maxCount: 1 },
  ]),
  async (req, res) => {
    const [mysql, sett] = await isAllowed(req, res);
    if (!mysql || !sett) return;
    const { files } = req;
    const logo: Express.Multer.File = files['logoUpload'][0];
    const hero: Express.Multer.File = files['heroUpload'][0];
    const logoDest: File = { fileName: logo.filename, mimetype: logo.mimetype, destName: 'logo' };
    const heroDest: File = { fileName: hero.filename, mimetype: hero.mimetype, destName: 'heroImage' };
    await setup.setDesign(logoDest, heroDest);
    res.redirect('./complete');
  }
);

// PALETTE
router.get('/colors', async (req, res) => {
  const [mysql, sett] = await isAllowed(req, res);
  if (!mysql || !sett) return;
  const settings = constants.getConstant<SettingsInterface>('settings');
  res.render('setup/setup_color', { name: settings.serverName });
});

router.post('/colors', async (req, res) => {
  try {
    const { name, mainColor, secondaryMainColor, fillColor, fontColorDark, fontColorLight } = req.body;
    await DatabaseConnection.instance.addPalette(
      name,
      mainColor,
      secondaryMainColor,
      fillColor,
      fontColorDark,
      fontColorLight,
      1
    );
  } catch (err) {
    const { message } = err.getMessage();
    return res.render('setup/error', {
      page: 'colors',
      error: { reason: err.getMessage() },
    });
  }
  return res.redirect('./template');
});

// TEMPLATE
router.get('/template', async (req, res) => {
  const [mysql, sett] = await isAllowed(req, res);
  if (!mysql || !sett) return;
  const settings = constants.getConstant<SettingsInterface>('settings');

  const { serverName } = settings;
  res.render('setup/setup_design', { name: serverName });
});

router.post('/template', async (req, res) => {
  // TODO: implemented code...
});

// COMPLETE
router.get('/complete', async (req, res) => {
  const [mysql, sett] = await isAllowed(req, res);
  if (!mysql || !sett) return;
  const settings = constants.getConstant<SettingsInterface>('settings');

  const { serverName } = settings;
  await setup.complete();
  res.render('setup/setup_complete', { name: serverName });
});

// LOGIN WEBADMIN
router.get('/webadmin', async (req, res) => {
  const [mysql] = await isAllowed(req, res);

  const { session } = req.session;
  const account = getAccount(session);
  if (account) {
    return res.redirect('./colors');
  }
  if (mysql) {
    const settings = constants.getConstant<SettingsInterface>('settings');
    const { serverName } = settings;
    return res.render('./setup/setup_login', { name: serverName });
  }
});

router.post('/webadmin', async (req, res) => {
  const [mysql] = await isAllowed(req, res);
  if (!mysql) return;

  const { form, password, confirm_password, username, email } = req.body;

  // error prevention
  if (!form || (form !== 'register' && form !== 'login')) {
    return res.render('setup/error', {
      page: 'webadmin',
      error: { reason: 'Invalid post form' },
    });
  }

  if (form === 'register') {
    if (password !== confirm_password) {
      return res.render('setup/error', {
        page: 'webadmin',
        error: { reason: 'Passwords does not match!' },
      });
    }
    const { account } = await io.register(req.session, username, md5(password), new Date(), email);
    await DatabaseConnection.getInstance().updateAccount(account.id, { webadmin: 5 });
  } else if (form === 'login') {
    const { REST, account } = await io.login(req.session, username, md5(password));
    const { loggedin, reason } = REST;
    if (!loggedin) {
      return res.render('setup/error', {
        page: 'webadmin',
        error: { reason },
      });
    }
    await DatabaseConnection.getInstance().updateAccount(account.id, { webadmin: 5 });
  }
  return res.redirect('./colors');
});

router.all(['/', 'index'], (req, res) => {
  return res.render('setup/index');
});

router.all('/:id/', async (req, res, next) => {
  const number = parseInt(req.params.id, 10);
  if (!number || number > 2) return next();
  if (number) {
    if (req.method === 'POST') {
      switch (number) {
        case 1: {
          const { prefix, user, password, host, database } = req.body;
          const auth: DatabaseAuthInterface = {
            user,
            host,
            database,
            password,
          };
          try {
            await setup.connectToDatabase(auth, prefix);
            return res.redirect(`${number + 1}`);
          } catch (err) {
            let errorMessage = app.getDatabase().printError(err.getErrorCode());
            if (!errorMessage) errorMessage = err.getMessage();

            return res.render('setup/error', {
              page: number,
              error: { reason: errorMessage },
            });
          }
        }
        case 2:
          try {
            const { version, exp, vp, serverName, drop, meso, nx, gmLevel, downloadSetup, downloadClient } = req.body;
            const settings: SettingsInterface = {
              version,
              gmLevel,
              serverName,
              expRate: exp,
              vpColumn: vp,
              dropRate: drop,
              mesoRate: meso,
              nxColumn: nx,
            };
            await setup.settings(settings, downloadSetup, downloadClient);
            app.getApp().locals.palette = constants.getConstant<PalettesInterface>('palette');
            app.getApp().locals.heroImage = 'headerImage.png';
            app.getApp().locals.logo = 'svgs/logo.svg';
            return res.redirect('./webadmin');
          } catch (err) {
            return res.render('setup/error', { page: number, error: { reason: err.getMessage() } });
          }
        default:
          return res.render('error', { page: number, error: { reason: 'something went wrong' } });
      }
    } else {
      const { server } = await getConfig();
      const { settingsComplete } = await setup.setupData();
      if (number !== 1 && (!DatabaseConnection.isConnected() || server.database.prefix.length === 0)) {
        return res.redirect('1');
      }
      if (number === 1) {
        if (server.database.prefix.length > 0) {
          return res.redirect('2');
        }
      }
      if (number === 2 && settingsComplete) {
        return res.redirect('webadmin');
      }
      return res.render(`setup/setup_${number}`);
    }
  } else {
    return res.redirect('/');
  }
});
export default router;
