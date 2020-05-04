import DatabaseConnection from './core/database/DatabaseConnection';
import InstallationHandler from './setup/InstallationHandler';
import * as consts from './core/Constants';
import Logger from './core/logger/Logger';
import { DesignInterface, PalettesInterface, SettingsInterface } from './core/Interfaces/DatabaseInterfaces';
import HOME from './Paths';
import { getConfig } from './core/config/Config';

function setConstants(settings: SettingsInterface, design: DesignInterface, palette: PalettesInterface) {
  consts.setConstant('settings', settings);
  consts.setConstant('heroImage', design.heroImage);
  consts.setConstant('logo', design.logo);
  consts.setConstant('palette', palette);
}

/**
 * sets up the server with constans and configs.
 * @param setupListeners callback to setup all listeners
 * @param setupComplete callback when the setup is complete.
 */
export default async function setup(setupListeners: () => void, setupComplete: () => void): Promise<void> {
  const installer = new InstallationHandler();
  setupListeners();
  let data;
  const config = await getConfig();
  const { prefix } = config.server.database;
  try {
    data = await installer.getInstallerObject('/settings/setup.MN');
  } catch (err) {
    Logger.warn('debug', 'To begin setup, visit /setup');
    return;
  }

  if (!data.mysqlSetupComplete) {
    Logger.warn('debug', 'To begin setup, visit /setup');
    return;
  }

  if (prefix.length !== 0) {
    consts.setConstant('prefix', prefix);
    consts.setConstant('realPath', HOME);
    try {
      const settings = await DatabaseConnection.instance.getSettings();
      const design = await DatabaseConnection.instance.getDesign({ select: ['heroImage', 'logo'] });
      const palette = await DatabaseConnection.instance.getActivePalette();
      setConstants(settings, design, palette);
    } catch (err) {
      Logger.log('debug', err.message);
    }
  }
  if (!data.done) {
    consts.setConstant('setup-status', -1);
    Logger.warn('debug', 'setup incomplete: visit localhost/setup');
  } else {
    setupComplete();
  }
}
