import { Database, Rank, SWO } from './Database';
import {
  AccountsInterface,
  CharactersInterface,
  DownloadsInterface,
  LayoutInterface,
  PalettesInterface,
  ReportsInterface,
  SettingsInterface,
  VoteInterface,
} from '../Interfaces/DatabaseInterfaces';
import { DatabaseAuthInterface, EquipmentInterface, File, TaggedFile } from '../Interfaces/Interfaces';
import MemoryCacher from '../tools/MemoryCacher';

export default class DatabaseCacher implements Database {
  private cacher: MemoryCacher;

  private database: Database;

  private readonly LIFETIME = 15000;

  constructor(database, auth: DatabaseAuthInterface) {
    this.database = database;
    this.database.onInstansiate(auth);
    this.cacher = new MemoryCacher();
  }

  addAccount(name: string, password: string, birthday: Date, email: string): Promise<number> {
    const resp = this.database.addAccount(name, password, birthday, email);
    this.cacher.remove('accounts');
    return resp;
  }

  addDownload(name: string, url: string): Promise<number> {
    const resp = this.database.addDownload(name, url);
    this.cacher.remove('downloads');
    return resp;
  }

  addFile(file: string, tags: string[]): Promise<TaggedFile> {
    const resp = this.database.addFile(file, tags);
    this.cacher.remove('files');
    return resp;
  }

  addPalette(
    name: string,
    mainColor: string,
    secondaryMainColor: string,
    fontColorDark: string,
    fontColorLight: string,
    fillColor: string,
    active: number
  ): Promise<number> {
    const resp = this.database.addPalette(
      name,
      mainColor,
      secondaryMainColor,
      fontColorDark,
      fontColorLight,
      fillColor,
      active
    );
    this.cacher.remove('palettes');
    return resp;
  }

  addSettings(
    serverName: string,
    version: string,
    expRate: string,
    dropRate: string,
    mesoRate: string,
    nxColumn: string,
    vpColumn: string,
    gmLevel: number
  ): Promise<boolean> {
    const resp = this.database.addSettings(serverName, version, expRate, dropRate, mesoRate, nxColumn, vpColumn, gmLevel);
    this.cacher.remove('palettes');
    return resp;
  }

  addTag(tag: string): Promise<boolean> {
    const resp = this.database.addTag(tag);
    this.cacher.remove('tags');
    return resp;
  }

  addVote(name: string, url: string, nx: number, time: number): Promise<number> {
    const resp = this.database.addVote(name, url, nx, time);
    this.cacher.remove('votes');
    return resp;
  }

  deleteDownload(id: number): Promise<number> {
    const resp = this.database.deleteDownload(id);
    this.cacher.remove('downloads');
    return resp;
  }

  deleteFile(file: string): Promise<boolean> {
    const resp = this.database.deleteFile(file);
    this.cacher.remove('files');
    return resp;
  }

  deletePalette(name: string): Promise<number> {
    const resp = this.database.deletePalette(name);
    this.cacher.remove('palettes');
    return resp;
  }

  deleteVote(id: number): Promise<number> {
    const resp = this.database.deleteVote(id);
    this.cacher.remove('votes');
    return resp;
  }

  enablePalette(id: string): Promise<PalettesInterface> {
    const resp = this.database.enablePalette(id);
    this.cacher.remove('palettes');
    return resp;
  }

  getAccount(name: string, obj?: SWO): Promise<AccountsInterface> {
    if(this.cacher.exists('accounts')) return this.cacher.get('accounts')[name];
    return this.database.getAccount(name, obj);
  }

  getAccountById(id: number, obj?: SWO): Promise<AccountsInterface> {
    return this.database.getAccountById(id, obj);
  }

  getAccountVote(accountId: number): Promise<VoteInterface[]> {
    return this.database.getAccountVote(accountId);
  }

  getAccountWithPassword(name: string, password: string, obj?: SWO): Promise<AccountsInterface> {
    return this.database.getAccountWithPassword(name, password, obj);
  }

  getActivePalette(obj?: SWO): Promise<PalettesInterface> {
    return this.database.getActivePalette(obj);
  }

  getAllTags(): Promise<string[]> {
    return this.database.getAllTags();
  }

  getCharacter(name: string, obj?: SWO): Promise<CharactersInterface> {
    return this.database.getCharacter(name, obj);
  }

  getDownloads(obj?: SWO): Promise<DownloadsInterface[]> {
    return this.database.getDownloads(obj);
  }

  getEquipment(character: number): Promise<EquipmentInterface[]> {
    return this.database.getEquipment(character);
  }

  getFiles(): Promise<File[]> {
    return this.database.getFiles();
  }

  getFilesByTag(tag: string): Promise<TaggedFile[]> {
    return this.database.getFilesByTag(tag);
  }

  getFilesWithTag(): Promise<TaggedFile[]> {
    return this.database.getFilesWithTag();
  }

  getLayout(name: string, obj?: SWO): Promise<LayoutInterface> {
    return this.database.getLayout(name, obj);
  }

  getLogs(): Promise<any> {
    return this.database.getLogs();
  }

  getPalette(name: string, obj?: SWO): Promise<PalettesInterface> {
    return this.database.getPalette(name, obj);
  }

  getPalettes(): Promise<PalettesInterface[]> {
    return this.database.getPalettes();
  }

  getReports(): Promise<ReportsInterface[]> {
    return this.database.getReports();
  }

  getSettings(obj?: SWO): Promise<SettingsInterface> {
    return this.database.getSettings(obj);
  }

  getTags(file: string): Promise<TaggedFile> {
    return this.database.getTags(file);
  }

  getVote(id: number, obj?: SWO): Promise<VoteInterface> {
    return this.database.getVote(id, obj);
  }

  getVotes(obj?: SWO): Promise<VoteInterface[]> {
    return this.database.getVotes(obj);
  }

  onInstansiate(data: DatabaseAuthInterface): Promise<boolean> {
    return this.database.onInstansiate(data);
  }

  printError(errno: number) {
    return this.database.printError(errno);
  }

  rank(
    orderby: 'level' | 'fame',
    rankby: { job?: number; search?: string },
    page: number,
    limit: number
  ): Promise<Rank[]> {
    return this.database.rank(orderby, rankby, page, limit);
  }

  rebuildDatabase(prefix: string): Promise<boolean> {
    return this.database.rebuildDatabase(prefix);
  }

  removeAllLogs(): Promise<any> {
    return this.database.removeAllLogs();
  }

  removeLog(id: string): Promise<boolean> {
    return this.database.removeLog(id);
  }

  removeReports(victimid: number): Promise<boolean> {
    return this.database.removeReports(victimid);
  }

  removeTag(file: string, tag: string): Promise<boolean> {
    return this.database.removeTag(file, tag);
  }

  setAccountVoted(accountid: number, voteid: number): Promise<number> {
    return this.database.setAccountVoted(accountid, voteid);
  }

  tagFile(file: string, tag: string): Promise<number> {
    return this.database.tagFile(file, tag);
  }

  updateAccount(id: number, newData: AccountsInterface): Promise<AccountsInterface> {
    return this.database.updateAccount(id, newData);
  }

  updateDownload(id: number, name: string, url: string): Promise<boolean> {
    return this.database.updateDownload(id, name, url);
  }

  updateLayout(name: string, json: string): Promise<number> {
    return this.database.updateLayout(name, json);
  }

  updatePalette(
    name: string,
    mainColor: string,
    secondaryMainColor: string,
    fontColorDark: string,
    fontColorLight: string,
    fillColor: string
  ): Promise<number> {
    return this.database.updatePalette(name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor);
  }

  updateVote(id: number, name: string, url: string, nx: number, time: number): Promise<number> {
    return this.database.updateVote(id, name, url, nx, time);
  }
}
