import mysql from 'mysql2/promise';
import { Database, Rank, SWO } from '../Database';
import {
  accountsConversion,
  charactersConversion,
  mn_designConversion,
  mn_downloadsConversion,
  mn_layoutConversion,
  mn_palettesConversion,
  mn_settingsConversion,
  mn_voteConversion,
} from './MysqlConversions';
import {
  AccountsInterface,
  CharactersInterface,
  DesignInterface,
  DownloadsInterface,
  LayoutInterface,
  PalettesInterface,
  SettingsInterface,
  VoteInterface,
  VotingInterface,
} from '../../Interfaces/DatabaseInterfaces';
import { DatabaseAuthInterface, EquipmentInterface } from '../../Interfaces/Interfaces';
import Errno from '../../tools/Errno';

import * as Constants from '../../Constants';
import FileTools from '../../tools/FileTools';
import { MysqlListenError } from '../../tools/ErrnoConversion';
import DatabaseError from './DatabaseError';

// Helper methods
function table(name: string, usePrefix: boolean = true): string {
  if (!usePrefix) return name;
  return `${Constants.getConstant('prefix')}_${name}`;
}

function convert(rows: any[], conversions: any): any[] {
  const row = new Array(rows.length);
  for (let i = 0; i < rows.length; i++) {
    row[i] = {};
    const keys = Object.keys(rows[i]);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      row[i][key] = conversions[key](rows[i][key]);
    }
  }
  return row;
}

export default class MysqlDatabase implements Database {
  connection: any;

  async onInstansiate(data: DatabaseAuthInterface): Promise<boolean> {
    const connectionData: DatabaseAuthInterface & { multipleStatements: boolean } = {
      ...data,
      multipleStatements: true,
    };
    try {
      this.connection = await mysql.createConnection(connectionData);
    } catch (err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
    return true;
  }

  private async generateSelectSql(obj: SWO, tableName: string, usePrefix: boolean): Promise<any> {
    let select = '*';
    let where = '';
    let order = '';
    if (obj) {
      // builds select statement into sql string.
      if (obj.select) {
        select = '';
        for (let i = 0; i < obj.select.length; i++) select += `${obj.select[i]},`;
        select = select.substring(0, select.length - 1);
      }

      // Builds where statement into string.
      if (obj.where) {
        where = '';
        let pre = 'WHERE';
        const whereKeys = Object.keys(obj.where);
        for (let i = 0; i < whereKeys.length; i++) {
          const key = whereKeys[i];
          if (obj.where[key] instanceof Array) {
            const arr = <string[]>obj.where[key];
            for (let j = 0; j < arr.length; j++) {
              where += `${pre} ${key}='${arr[j]}' `;
              pre = 'OR';
            }
          } else {
            where += `${pre} ${key}='${obj.where[key]}' `;
          }
          pre = 'AND';
        }
      }
      // builds order statement into sql string.
      if (obj.order) {
        const key = Object.keys(obj.order)[0];
        order = `ORDER BY ${key} ${obj.order[key]}`;
      }
    }
    return this.connection.query(`SELECT ${select} FROM ${table(tableName, usePrefix)} ${where}${order}`);
  }

  private async exec<T>(obj: SWO, name: string, conversions?: any, usePrefix: boolean = true): Promise<[T[], string]> {
    let err;
    let row: any[];
    try {
      const [rows] = await this.generateSelectSql(obj, name, usePrefix);
      row = rows;
      if (conversions) {
        row = convert(rows, conversions);
      }
    } catch (error) {
      err = error.message;
    }
    return [row, err];
  }

  async getCharacter(name: string, obj?: SWO): Promise<CharactersInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: {},
        select: [],
      };
    }
    sqlObj.where['name'] = name;
    sqlObj.select.push('id');
    const [rows, err] = await this.exec<CharactersInterface>(sqlObj, 'characters', charactersConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getSettings(obj: SWO): Promise<SettingsInterface> {
    const [rows, err] = await this.exec<SettingsInterface>(obj, 'settings', mn_settingsConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getDesign(obj?: SWO): Promise<DesignInterface> {
    const [rows, err] = await this.exec<DesignInterface>(obj, 'design', mn_designConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getActivePalette(obj?: SWO): Promise<PalettesInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['active'] = 1;
    const [rows, err] = await this.exec<PalettesInterface>(obj, 'palettes', mn_palettesConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getDownloads(obj?: SWO): Promise<DownloadsInterface[]> {
    const [rows, err] = await this.exec<DownloadsInterface>(obj, 'downloads', mn_downloadsConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows;
  }

  async getVotes(obj?: SWO): Promise<VoteInterface[]> {
    const [rows, err] = await this.exec<VoteInterface>(obj, 'vote', mn_voteConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows;
  }

  async getVote(id: number, obj?: SWO): Promise<VoteInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['id'] = id;
    const [rows, err] = await this.exec<VoteInterface>(sqlObj, 'vote', mn_voteConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getPalette(id: string, obj: SWO): Promise<PalettesInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['id'] = id;
    const [rows, err] = await this.exec<PalettesInterface>(sqlObj, 'palettes', mn_palettesConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getLayout(name: string, obj: SWO): Promise<LayoutInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['name'] = name;
    const [rows, err] = await this.exec<LayoutInterface>(sqlObj, 'layout', mn_layoutConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getAccount(name: string, obj: SWO): Promise<AccountsInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['name'] = name;
    const [rows, err] = await this.exec<AccountsInterface>(sqlObj, 'accounts', accountsConversion, false);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  async getAccountById(id: number, obj?: SWO): Promise<AccountsInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['id'] = id;
    const [rows, err] = await this.exec<AccountsInterface>(sqlObj, 'accounts', accountsConversion, false);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return null;
    return rows[0];
  }

  getAccountWithPassword(name: string, password: string, obj?: SWO): Promise<AccountsInterface> {
    let sqlObj = obj;
    if (!sqlObj) {
      sqlObj = {
        where: [],
      };
    }
    sqlObj.where['password'] = password;
    return this.getAccount(name, sqlObj);
  }

  async addPalette(name, mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor, active) {
    const insertId = await this.insert(`INSERT INTO ${table(
      'palettes',
      true
    )} (name,mainColor,secondaryMainColor,fontColorDark,fontColorLight,fillColor,active) VALUES
        (?,?,?,?,?,?,?)`,
        [
            name,
            mainColor,
            secondaryMainColor,
            fontColorDark,
            fontColorLight,
            fillColor,
            active
        ]);
    return insertId;
  }

  private async insert(query, data) {
    try {
      const [rows] = await this.connection.execute(query,data);
      return rows.insertId;
    } catch(err) {
      throw new DatabaseError({errno: err.errno, msg: err.message});
    }
  }

  private async delete(query, data) {
    try {
      const [rows] = await this.connection.execute(query,data);
      return rows.affectedRows;
    } catch(err) {
      throw new DatabaseError({errno: err.errno, msg: err.message});
    }
  }

  async addDownload(name, url) {
    const insertId = await this.insert(`INSERT INTO ${table('downloads')} (name,url) VALUES
    (?,?)`, [name,url]);
    return insertId;
  }

  async updateLayout(name: string, json: string): Promise<number> {
    const insertId = await this.insert(`INSERT INTO ${table('layout')} (name,json) VALUES
        (?,?)`,[name,json]);
    return insertId;
  }

  async addDesign(heroImage, logo): Promise<number> {
    const insertId = await this.insert(`INSERT INTO ${table('design')} (heroImage,logo) VALUES
        (?,?)`,[heroImage, logo]);
    return insertId;
  }

  async addSettings(serverName, version, expRate, dropRate, mesoRate, nxColumn, vpColumn, gmLevel): Promise<boolean> {
    const insertId = await this.insert(`INSERT INTO ${table('settings')} (serverName,version,expRate,dropRate,mesoRate,nxColumn,vpColumn,gmLevel)
                VALUES(
                    ?,?,?,?,?,?,?,?
                )`,[serverName, version, expRate, dropRate, mesoRate, nxColumn, vpColumn, gmLevel]);
    return insertId;
  }

  async rebuildDatabase(prefix): Promise<boolean> {
    const file = await FileTools.readFile('./settings/setup.sql', 'utf8');
    const files = file
      .replace(/prefix/g, prefix)
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/\r/g, '')
      .split(';');
    try {
      for (let i = 0; i < files.length; i++) {
        if (files[i].length !== 0 && !(files[i].charAt(0) === '-' && files[i].charAt(1) === '-')) {
          // eslint-disable-next-line no-await-in-loop
          await this.connection.query(files[i]);
        }
      }
    } catch (err) {
      throw new DatabaseError({ errno: err.errno, msg: err.sqlMessage });
    }
    return true;
  }

  async addAccount(name: string, password: string, birthday: Date, email: string): Promise<number> {
    const birth = birthday.toISOString().slice(0, 19).replace('T', ' ');
    const insertId = await this.insert(
      `INSERT INTO accounts (name,password,birthday,email,lastknownip,NomePessoal,fb,twt) VALUES(?,?,?,?,'0',' ',' ',' ')`,
        [name, password, birth, email]
    );
    return insertId;
  }

  async addVote(name: string, url: string, nx: number, time: number): Promise<number> {
    const tableName = table('vote');
    const insertId = await this.insert(`INSERT INTO ${tableName} (name, url, nx, time) VALUES(?,?,?,?)`, [
      name,
      url,
      nx,
      time,
    ]);
    return insertId;
  }

  async setAccountVoted(accountid: number, voteid: number): Promise<number> {
    const tableName = table('voting');
    const insertId = await this.insert(`INSERT INTO ${tableName} (accountid, voteid, date) VALUES(?,?,NOW())`, [
      accountid,
      voteid,
    ]);
    return insertId;
  }

  async deleteDownload(id: number): Promise<number> {
    const tableName = table('downloads');
    const affectedRows = await this.delete(`DELETE FROM ${tableName} WHERE id=?`, [id]);
    return affectedRows;
  }

  async deletePalette(name: string): Promise<number> {
    const tableName = table('palettes');
    const affectedRows = await this.delete(`DELETE FROM ${tableName} WHERE name=?`, [name]);
    return affectedRows;
  }

  async deleteVote(id: number): Promise<number> {
    const tableName = table('vote');
    const affectedRows = await this.delete(`DELETE FROM ${tableName} WHERE id=?`, [id]);
    return affectedRows;
  }

  async enablePalette(id: number): Promise<PalettesInterface> {
    const tableName = table('palettes');
    await this.connection.query(`UPDATE ${tableName} SET active=0 WHERE active=1`);
    await this.connection.execute(`UPDATE ${tableName} SET active=1 WHERE id=?`, [id]);
    const [result] = await this.connection.execute(`SELECT ${tableName} WHERE id=?`, [id]);
    return result[0];
  }

  async updateDownload(id: number, name: string, url: string): Promise<boolean> {
    const tableName = table('downloads');
    try {
      const [result] = await this.connection.execute(`UPDATE ${tableName} SET name=?, url=? WHERE id=?`, [name, url, id]);
      return result.affectedRows;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }

  async updateHeroImage(heroImage: string): Promise<boolean> {
    const tableName = table('design');
    try {
      const [result] = await this.connection.execute(`UPDATE ${tableName} SET heroImage=?`, [heroImage]);
      return result.affectedRows;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }

  async updateLogo(logo: string): Promise<boolean> {
    const tableName = table('design');
    try {
      const [result] = await this.connection.execute(`UPDATE ${tableName} SET logo=?`, [logo]);
      return result.affectedRows;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }

  async updatePalette(
    name: string,
    mainColor: string,
    secondaryMainColor: string,
    fontColorDark: string,
    fontColorLight: string,
    fillColor: string
  ): Promise<number> {
    const tableName = table('palettes');
    try {
      const [
        result,
      ] = await this.connection.execute(
          `UPDATE ${tableName} SET mainColor=? secondaryMainColor=? fontColorDark=? fontColorLight=? fillColor=? WHERE name=?`,
          [mainColor, secondaryMainColor, fontColorDark, fontColorLight, fillColor, name]
      );
      return result.affectedRows;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }

  async getEquipment(character: number): Promise<EquipmentInterface[]> {
    try {
      const [
        result,
      ] = await this.connection.execute(
          `SELECT inventoryequipment.* FROM inventoryitems INNER JOIN inventoryequipment ON inventoryitems.inventoryitemid = inventoryequipment.inventoryitemid WHERE characterid=?`,
          [character]
      );
      return result;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }

  async getAccountVote(accountId: number): Promise<VotingInterface[]> {
    const sqlObj = {
      where: { accountId },
    };
    const [rows, err] = await this.exec<VotingInterface>(sqlObj, 'voting', accountsConversion);
    if (err) {
      throw new DatabaseError({ errno: 0, msg: err });
    }
    if (rows.length === 0) return [];
    return rows;
  }

  // eslint-disable-next-line class-methods-use-this
  printError(errno: any) {
    return MysqlListenError.error(errno);
  }

  private async update(database: string, where: any, data: any) {
    let query = `UPDATE ${database}`;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      query += ` SET ${keys[i]}='${data[keys[i]]}'`;
    }

    const whereKeys = Object.keys(where);
    query += ` WHERE ${whereKeys[0]}='${where[whereKeys[0]]}'`;
    for (let i = 1; i < whereKeys.length; i++) {
      query += ` AND ${whereKeys[i]}='${where[whereKeys[i]]}'`;
    }
    return this.connection.query(query);
  }

  async updateAccount(id: number, newData: AccountsInterface): Promise<AccountsInterface> {
    Object.keys(newData);
    const data = newData;
    await this.update('accounts', { id }, newData);
    return data;
  }

  async rank(
    orderby: 'level' | 'fame' | 'job',
    rankby: { job?: number; search?: string },
    page: number,
    limit: number = 5
  ): Promise<Rank[]> {
    let where = '';
    const searches = [];
    if (rankby.job && rankby.job !== -1) {
      searches.push(`job='${rankby.job}'`);
    }
    if (rankby.search) {
      searches.push(`name LIKE '%${rankby.search}%'`);
    }
    if (searches.length !== 0) {
      let pre = 'WHERE';
      for (let i = 0; i < searches.length; i++) {
        where += `${pre} ${searches[i]}`;
        pre = 'AND';
      }
    }

    const offset = Math.max(page, 0) * limit;
    console.log();
    const [rows] = await this.connection.execute(
      `
            SELECT
              id,
              level,
              global._order as global_level_order,
              # what rank that character is in on level.
              fame._order as global_fame_order,
              J.job_rank as job_order,
              job
            FROM
              characters
              INNER JOIN (
                #Calculates rank by level.
                SELECT
                  id as _id,
                  @pos := @pos + 1 as _order
                FROM
                  characters
                  INNER JOIN (
                    SELECT
                      @pos := 0
                  ) R
                ORDER BY
                  level DESC
              ) as global ON global._id = id
              INNER JOIN (
                #Calculates rank by fame.
                SELECT
                  id as _id,
                  @fame_pos := @fame_pos + 1 as _order
                FROM
                  characters
                  INNER JOIN (
                    SELECT
                      @fame_pos := 0
                  ) R
                ORDER BY
                  fame DESC
              ) as fame ON fame._id = id
              INNER JOIN (
                #Calculates rank by level grouped by job.
                SELECT
                  id as _id,
                  @job_rank := IF(@job = job, @job_rank + 1, 1) as job_rank,
                  @job := job
                FROM
                  characters
                ORDER BY
                  job
              ) as J ON J._id = id
            ${where} ORDER BY ? LIMIT ? OFFSET ?
        `,
      [orderby, limit, offset]
    );
    if (rows.length === 0) return [];
    const ret: Rank[] = [];
    for (let i = 0; i < rows.length; i++) {
      ret.push({
        id: rows[i].id,
        level: rows[i].level,
        fame: rows[i].level,
        globalLevelOrder: rows[i].global_level_order,
        globalFameOrder: rows[i].global_fame_order,
        jobOrder: rows[i].job_order,
        job: rows[i].job,
      });
    }
    return ret;
  }

  async getPalettes(): Promise<PalettesInterface[]> {
    const [result] = await this.exec<PalettesInterface>({}, 'palettes', mn_palettesConversion);
    return result;
  }

  async updateVote(id: number, name: string, url: string, nx: number, time: number): Promise<number> {
    const tableName = table('vote');
    try {
      const [result] = await this.connection.execute(`UPDATE ${tableName} SET name = ?, url = ?, nx = ?, time = ? WHERE id = ?`, [
        name,
        url,
        nx,
        time,
        id,
      ]);
      return result.affectedRows;
    } catch(err) {
      throw new DatabaseError({ errno: err.errno, msg: err.message });
    }
  }
}
