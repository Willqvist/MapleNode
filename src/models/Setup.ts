import mime from 'mime-types';
import InstallationHandler, { InstallerI } from '../setup/InstallationHandler';
import FileTools from '../core/tools/FileTools';
import DBConn from '../core/database/DatabaseConnection';
import app from '../app';
import { SettingsInterface } from '../core/Interfaces/DatabaseInterfaces';
import * as constants from '../core/Constants';
import { openConfig } from '../core/config/Config';
import { DatabaseAuthInterface, File } from '../core/Interfaces/Interfaces';

/**
 * moves a file from upload/ to public/upload/
 * @param file the file to move.
 */
async function moveImage(file: File) {
  const ext = mime.extension(file.mimetype);
  await FileTools.move(`upload/${file.fileName}`, `public/upload/${file.destName}.${ext}`);
}

export default class Setup {
  private installHandler: InstallationHandler;

  private readonly settingsSrc: string = '/settings/setup.MN';

  constructor() {
    this.installHandler = new InstallationHandler();
  }

  /**
   * sets the images in public/images
   * @param logo, the logo image
   * @param hero, the hero image
   */
  public async setDesign(logo?: File, hero?: File): Promise<void> {
    if (logo) await moveImage(logo);
    if (hero) await moveImage(hero);
  }

  /**
   * connects to the database.
   * @param data, authentication for the database and prefix.
   */
  public async connectToDatabase(auth: DatabaseAuthInterface & { prefix: number }) {
    await DBConn.createInstance(app.getDatabase(), auth);
    const writer = await openConfig();
    await writer.write('server/database/prefix', auth.prefix);
    await writer.write('server/database/auth', auth);
    await this.installHandler.setMysqlSetupComplete(auth);
  }

  /**
   *
   * @param data
   * @param clientUrl
   * @param setupUrl
   */
  public async settings(data: SettingsInterface, clientUrl: string, setupUrl: string) {
    await this.installHandler.saveSettings(data, setupUrl, clientUrl, this.settingsSrc);
    constants.setConstant('setup-status', 1);
    constants.setConstant('settings', data);
  }

  public async setupData(): Promise<InstallerI> {
    return this.installHandler.installationComplete(this.settingsSrc);
  }

  async complete() {
    const installer = await this.installHandler.getInstallerObject(this.settingsSrc);
    installer.done = true;
    await this.installHandler.saveInstallerObject(installer, this.settingsSrc);
  }
}
