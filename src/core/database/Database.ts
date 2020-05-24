import { PathLike } from 'fs';
import {
  AccountsInterface,
  CharactersInterface,
  DesignInterface,
  DownloadsInterface,
  LayoutInterface,
  PalettesInterface,
  SettingsInterface,
  VoteInterface,
} from '../Interfaces/DatabaseInterfaces';
import { DatabaseAuthInterface, EquipmentInterface, File, TaggedFile } from '../Interfaces/Interfaces';

/**
 *  SWO(select where order) Used to specify extra
 *  functionality to get methods in {@link Database}
 *
 */
export interface SWO {
  /**
   * a list of things to select from the database
   */
  select?: string[];

  /**
   * different conditions that the queried data most
   * match.
   */
  where?: { [key: string]: any };

  /**
   * orders the data in descending or ascending order.
   */
  order?: 'asc' | 'desc';
}

/**
 * Interface for a database.
 */
export interface Database {
  /**
   * instantiates the database.
   * @param data, authentication data to connect to the database.
   */
  onInstansiate(data: DatabaseAuthInterface): Promise<boolean>;

  /**
   * returns the settings from the database
   * @param obj extra conditions on the returned data.
   */
  getSettings(obj?: SWO): Promise<SettingsInterface>;

  /**
   * returns a character with a given name
   * @param name the name of the character to get.
   * @param obj extra conditions on the returned data.
   */
  getCharacter(name: string, obj?: SWO): Promise<CharactersInterface>;

  /**
   * returns the active color palette of the website.
   * @param obj extra conditions on the returned data.
   */
  getActivePalette(obj?: SWO): Promise<PalettesInterface>;

  /**
   * returns all the downloads.
   * @param obj extra conditions on the returned data.
   */
  getDownloads(obj?: SWO): Promise<DownloadsInterface[]>;
  getVotes(obj?: SWO): Promise<VoteInterface[]>;

  /**
   * get a vote by its id
   * @param id the id of the vote to get.
   * @param obj extra conditions on the returned data.
   */
  getVote(id: number, obj?: SWO): Promise<VoteInterface>;

  /**
   * returns the palette with a given name.
   * @param name the name of the palette.
   * @param obj extra conditions on the returned data.
   */
  getPalette(name: string, obj?: SWO): Promise<PalettesInterface>;

  getPalettes(): Promise<PalettesInterface[]>;

  /**
   * returns the layout by a given name, layout is in json format.
   * @param name name of the layout
   * @param obj extra conditions on the returned data.
   */
  getLayout(name: string, obj?: SWO): Promise<LayoutInterface>;

  /**
   * returns the equipment of a character.
   * @param character the characters id.
   */
  getEquipment(character: number): Promise<EquipmentInterface[]>;

  /**
   * returns the account of a given name
   * @param name the name of the account to return
   * @param obj extra conditions on the returned data.
   */
  getAccount(name: string, obj?: SWO): Promise<AccountsInterface>;

  /**
   * returns the account of a given name and it's password
   * @param name the name of the account to return
   * @param password the password of the account.
   * @param obj extra conditions on the returned data.
   */
  getAccountWithPassword(name: string, password: string, obj?: SWO): Promise<AccountsInterface>;

  /**
   * returns the account of a given id for an account
   * @param name the name of the account to return
   * @param obj extra conditions on the returned data.
   */
  getAccountById(id: number, obj?: SWO): Promise<AccountsInterface>;

  /**
   * adds a new account to the database.
   * @param name the name of the account
   * @param password the password for new new account
   * @param birthday birthday of the account
   * @param email the email for the account
   */
  addAccount(name: string, password: string, birthday: Date, email: string): Promise<number>;

  /**
   * updates a account in the database.
   * @param name the name of the account
   * @param password the password for new new account
   * @param birthday birthday of the account
   * @param email the email for the account
   */
  updateAccount(id: number, newData: AccountsInterface): Promise<AccountsInterface>;

  /**
   * updates the download with a given id
   * @param id the id of the download to update
   * @param name new name to the download
   * @param url new url to the download
   */
  updateDownload(id: number, name: string, url: string): Promise<boolean>;

  /**
   * Adds new Voting istance, ex. if an account has voted.
   * @param accountid the id of the account that voted
   * @param voteid the vote id that the account voted in.
   */
  setAccountVoted(accountid: number, voteid: number): Promise<number>;

  /**
   * adds a new Vote url to the database
   * @param name the name of the new vote
   * @param url the url wher ethe user votes.
   * @param nx amount of nx per vote
   * @param time cooldown between each vote, in minutes.
   * @return id of the new vote in the database.
   */
  addVote(name: string, url: string, nx: number, time: number): Promise<number>;

  /**
   * deletes a vote from the database.
   * @param id the id of the vote to remove.
   */
  deleteVote(id: number): Promise<number>;

  /**
   * sets the id of the palette to active.
   * @param id the id of the palette
   */
  enablePalette(id: number): Promise<PalettesInterface>;

  /**
   * removes a palette from the database.
   * @param name the name of the palette to remove.
   */
  deletePalette(name: string): Promise<number>;

  /**
   * removs a download with the given id
   * @param id the id of the download to remove.
   */
  deleteDownload(id: number): Promise<number>;

  /**
   * adds a new download to the database
   * @param name the name of the download
   * @param url the url to the download file
   */
  addDownload(name: string, url: string): Promise<number>;

  /**
   * updates the layout of a given name.
   * @param name the name of the layout to update
   * @param json the new json data for the layout
   */
  updateLayout(name: string, json: string): Promise<number>;

  updateVote(id: number, name: string, url: string, nx: number, time: number): Promise<number>;

  /**
   * rebuilds the database from the ground up with a new prefix
   * @param prefix the new prefix to rebuild the database with.
   */
  rebuildDatabase(prefix: string): Promise<boolean>;

  /**
   * adds a new palette to the database
   * @param name the name of the new palette
   * @param mainColor the main color of the palette
   * @param secondaryMainColor the secondary main color
   * @param fontColorDark font color dark, used on light backgrounds
   * @param fontColorLight font color light, used on dark backgrounds
   * @param fillColor fillColor.
   * @param active if active is 1, the palette will be set as the new active palette.
   */
  addPalette(
    name: string,
    mainColor: string,
    secondaryMainColor: string,
    fontColorDark: string,
    fontColorLight: string,
    fillColor: string,
    active: number
  ): Promise<number>;

  /**
   * updates a palette with new colors
   * @param id the id of the palette to update
   * @param mainColor the main color of the palette
   * @param secondaryMainColor the secondary main color
   * @param fontColorDark font color dark, used on light backgrounds
   * @param fontColorLight font color light, used on dark backgrounds
   * @param fillColor fillColor.
   * @param fillColor
   */
  updatePalette(
    name: string,
    mainColor: string,
    secondaryMainColor: string,
    fontColorDark: string,
    fontColorLight: string,
    fillColor: string
  ): Promise<number>;

  /**
   * adds new settings to the database.
   * @param serverName the name of the server
   * @param version what version the game is in
   * @param expRate the exp rate
   * @param dropRate the drop rate
   * @param mesoRate the meso rate
   * @param nxColumn the column in the database that will hold the nx for each player.
   * @param vpColumn the column in the database that will hold the vote points for each player.
   * @param gmLevel at what level a account is gm.
   */
  addSettings(
    serverName: string,
    version: string,
    expRate: string,
    dropRate: string,
    mesoRate: string,
    nxColumn: string,
    vpColumn: string,
    gmLevel: number
  ): Promise<boolean>;

  /**
   * returns all what urls a account has voted
   * and when.
   * @param accountId, id of the account to check.
   */
  getAccountVote(accountId: number): Promise<VoteInterface[]>;

  /**
   * returns a list of ranks depending on search
   * @param orderby, what to order by, level or fame.
   * @param rankby, rank by options, rank by jobs, rank by users name contaning search
   * @param page, page defined by limit, if apge is 1 and limit 10 it will return results between 10 and 20.
   * @param limit, max size of return array.
   */
  rank(
    orderby: 'level' | 'fame',
    rankby: { job?: number; search?: string },
    page: number,
    limit: number
  ): Promise<Rank[]>;

  /**
   * prints a database error depending on id.
   * @param errno the error id to print.
   */
  printError(errno: number);

  tagFile(file: string, tag: string): Promise<number>;

  getFiles(): Promise<File[]>;

  getTags(file: string): Promise<TaggedFile>;

  getFilesByTag(tag: string): Promise<TaggedFile[]>;

  addFile(file: string, tags: string[]): Promise<TaggedFile>;

  deleteFile(file: string): Promise<boolean>;

  getFilesWithTag(): Promise<TaggedFile[]>;

  getAllTags(): Promise<string[]>;

  addTag(tag: string): Promise<boolean>;
}

/*
json layout
{
    select:[]
    where:{a:2}
    order:{a:asc}
 */

/**
 * enum used in creating rank query to the database.
 * @internal
 */
export enum RANK {
  JOB = 1,
  NAME,
}

/**
 * @internal
 */
export enum ACCOUNT_FLAGS {
  voting = 1,
}

export interface Rank {
  id: number;
  level: number;
  fame: number;
  globalLevelOrder: number;
  globalFameOrder: number;
  jobOrder: number;
  job: number;
}
