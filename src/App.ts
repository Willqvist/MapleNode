// libaries
import ejs from 'ejs';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { Server } from 'http';
import * as consts from './core/Constants';
import HOME from './Paths';
import UrlSlicer from './Middleware';
import setup, {setExpressRender} from './setup';
import input from './In';
import Logger from './core/logger/Logger';
import cGen from './scripts/CSSGenerator/CSSGenerator';
import { PalettesInterface, SettingsInterface } from './core/Interfaces/DatabaseInterfaces';
import DatabaseConnection from './core/database/DatabaseConnection';
import { ConfigInterface, getConfig } from './core/config/Config';
import { Database } from './core/database/Database';

// Routers
import SetupRouter from './routers/SetupRouter';
import GlobalRouter from './routers/GlobalRouter';
import IORouter from './routers/IORouter';
import PagesRouter from './routers/PagesRouter';
import DashboardRouter from './routers/DashboardRouter';

/**
 * sets the log level depending on mode string
 * @param mode is either release or debug.
 */
function setRunMode(mode: string) {
  if (mode.toLocaleLowerCase() === 'release') {
    Logger.listenTo(['release', 'info', 'error']);
  } else {
    Logger.listenTo(['all']);
  }
}

export function setLocals(app: express.Application) {
  app.locals.palette = consts.getConstant('palette');
  app.locals.heroImage = consts.getConstant('heroImage');
  app.locals.logo = consts.getConstant('logo');
  app.locals.settings = consts.getConstant('settings');
  console.log("LOCALS",app.locals);
}

/**
 * The Main Application class that is created on launch.
 * This class holds information about the database, express application and
 * the nodeconfig.json file.
 */
class App {
  private readonly app: express.Application;

  private server: Server;

  private appConfig: ConfigInterface;

  constructor() {
    this.app = express();
  }

  /**
   * This method is called at start of the program
   */
  async init() {
    this.appConfig = await getConfig();
    setRunMode(this.appConfig.run.mode);
    this.listenToServer();
    this.config();
    await this.exitOnFailure(this.setupDatabase);
    await this.exitOnFailure(this.setup);
  }

  private listenToServer() {
    this.server = this.app.listen(this.appConfig.server.port);
    this.server.on('error', (err) => {
      Logger.error('error', err.message);
      process.exit(0);
    });
  }

  /**
   * @return The express Application
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * @return config file, from nodeconfig.json
   */
  public getConfig(): ConfigInterface {
    return this.appConfig;
  }

  /**
   * setup middleware for express.
   */
  private config() {
    const { app } = this;
    app.set('view engine', 'ejs');
    app.set('views', `${HOME}/views`);
    app.use(bodyParser.json({ limit: '1000mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(helmet());
  }

  /**
   * tries to connect to the database given in server/database/instance in
   * nodeconfig.json
   * @return true if connection was successful.
   */
  private async setupDatabase(): Promise<boolean> {
    const exists = this.getConfig().server.database.prefix.length !== 0;
    if (exists) {
      try {
        await DatabaseConnection.createInstance(this.getDatabase(), this.getConfig().server.database.auth);
      } catch (err) {
        Logger.warn('debug', 'Could not connected to database.');
        if (err.getErrorCode()) Logger.error('error', `[${err.getErrorCode()}] ${err.getMessage()}`);
        else Logger.error('error', err);
        return false;
      }
    } else {
      // fix so that id setup is done, set it to false...
    }
    return true;
  }

  /**
   * @return true if setup was successful.
   * will call {@link App.setupListeners} to setup listeners
   * and {@link App.setupComplete} when setup is finished.
   */
  private async setup(): Promise<boolean> {
    setExpressRender();
    await setup(this.setupListeners.bind(this), this.setupComplete.bind(this));
    return true;
  }

  private async await<S, T>(func: (S) => Promise<T>): Promise<T> {
    return func.bind(this)();
  }

  /**
   * will exit the program if a given function returns false or null.
   * @param func the function to exit on failure.
   */
  private async exitOnFailure(func) {
    const success = await this.await<any, any>(func);
    if (!success) this.exit();
  }

  /**
   * setups all listeners/routers for Express application.
   */
  private setupListeners() {
    const { app } = this;
    app.use(
      session({
        secret: 'XCDGREV34432',
        resave: false,
        saveUninitialized: true,
      })
    );
    app.use(express.static(`${HOME}/public`, { redirect: false }));
    app.use(UrlSlicer);
    app.use(async (req, res, next) => {
      // TODO: move to only build when changeing theme.
      const paletteInterface: PalettesInterface = {
        name: 'Happy Green',
        mainColor: '#69DC9E',
        secondaryMainColor: '#3E78B2',
        fontColorLight: '#D3F3EE',
        fontColorDark: '#20063B',
        fillColor: '#CC3363',
      };
      await cGen.generateCSS(paletteInterface);
      next();
    });
    app.use('/setup', SetupRouter);
    app.use('/', GlobalRouter);
    app.use('/', PagesRouter);
    app.use('/dashboard', DashboardRouter);
    app.use('/IO', IORouter);
    app.use((req, res) => {
      Logger.log('debug', `[${req.ip}] tried to visit ${req.originalUrl}`);
      res.status(404).render('error/404');
    });
  }

  private setupComplete() {
    // to include In.ts file. if removed, functions will not load. fix later...
    // eslint-disable-next-line no-unused-expressions
    input;
    const { app } = this;
    setLocals(app);
    Logger.log(
      'release',
      `${consts.getConstant<SettingsInterface>('settings').serverName} is Online on port ${this.appConfig.server.port}`
    );
  }

  /**
   * closes the server and exits the program
   */
  public exit() {
    this.server.close();
    process.exit(0);
  }

  /**
   * returns the established database
   */
  getDatabase(): Database {
    return this.getConfig().server.database.instance;
  }
}
const app = new App();
app.init().then(() => {});
export default app;
