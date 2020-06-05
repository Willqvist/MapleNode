import express from 'express';
import md5 from 'md5';
import * as constants from '../core/Constants';
import Logger from '../core/logger/Logger';
import DatabaseConnection from '../core/database/DatabaseConnection';
import IO from '../models/IO';
import { AccountsInterface } from '../core/Interfaces/DatabaseInterfaces';
import {getAccount, isAdmin, isLoggedIn, isWebAdmin} from '../models/SessionHandler';

const router = express.Router();
const io = new IO();

// Helper methods
function isBetween(data, min, max) {
  return data > min && data < max;
}

function sendJSON(res, json) {
  return res.send(JSON.stringify(json));
}

/**
 * REST api on post to /login.
 * body:
 * ```
 * {
 *     username:string,
 *     password:string
 * }
 * ```
 */
router.post('/login', async (req, res) => {
  const response = await io.login(req.session, req.body.username, md5(req.body.password));
  const { REST } = response;
  if (REST.success) {
    Logger.log('debug', `[${req.ip}] ${req.body.username} loggedin`);
  } else {
    Logger.log('debug', `[${req.ip}] tried to login with username ${req.body.username}`);
  }
  console.log(REST);
  sendJSON(res, REST);
});

/**
 * REST api on post to /register.
 * body:
 * ```
 * {
 *     username:string,
 *     password:string,
 *     c_password:string // confirmed password
 *     year:number,
 *     month:number,
 *     day:number,
 *     email:string
 *     c_email:string // confirmed email
 * }
 * ```
 * response:
 * ```
 * {
 *     success: boolean // true if register was successfull.
 *     error: string // contains reason why success is true or false.
 * }
 * ```
 */
router.post('/register', async (req, res) => {
  const { username, password, email, c_email, c_password, year, month, day } = this.body;

  if (!isBetween(username.length, 3, 15) && isBetween(username.length, 3, 15))
    return sendJSON(res, { success: false, error: 'Username and password most be between 3 and 15 characters' });
  if (c_password !== password) return sendJSON(res, { success: false, error: 'Passwords does not match' });
  if (c_email !== email) return sendJSON(res, { success: false, error: 'Emails does not match' });
  if (year <= 1800) return sendJSON(res, { success: false, error: 'Are you really over 200 years old?' });

  await io.register(req.session, username, md5(password), new Date(year, month, day), email);
  return sendJSON(res, {
    success: true,
    error: 'Register complete! You will be directed to a new page in 3 seconds...',
  });
});

/**
 * REST api on get on /vote/:name where :name is a name of a account,
 * returns the urls that acount has voted in the last time delay for each url.
 * params:
 * ```
 * {
 *     name:string
 * }
 *```
 * response:
 * ```
 * {
 *     success: boolean //true if account with :name was found
 *     reason: string //reason for value on success.
 *     userid: number // id of the account with name = :name
 *     occupied: VotingInterface[] // all pages the account has voted on.
 *     votes: VoteInterface[] // all voting pages.
 * }
 * ```
 */
router.get('/vote/:name', async (req, res) => {
  const { name } = req.params;
  const acc: AccountsInterface = await DatabaseConnection.instance.getAccount(name);
  if (!acc) return res.send(JSON.stringify({ success: false, reason: 'Could not find username' }));
  try {
    const votes = await DatabaseConnection.instance.getAccountVote(acc.id);
    console.log(votes);
    if (votes.length >= 1) {
      const ids = [];
      for (let i = 1; i < votes.length; i++) {
        ids.push(votes[i].ID);
      }

      const voteSites = await DatabaseConnection.instance.getVotes({ where: { id: ids } });
      return res.send(
        JSON.stringify({ success: true, reason: 'Found username', userid: acc.id, occupied: votes, votes: voteSites })
      );
    }
    return res.send(
      JSON.stringify({ success: true, reason: 'Found username', userid: acc.id, occupied: votes, votes: [] })
    );
  } catch (err) {
    return res.send(err);
  }
});

/**
 * REST api on post on /vote
 * body:
 * ```
 * {
 *     accid: number // id of the account that voted.
 *     id: nubmer //id of the vote that account voted with.
 * }
 *```
 * response:
 * ```
 * {
 *     success: boolean //true if account with :name was found
 *     reason: string //reason for value on success.
 * }
 * ```
 */
router.post('/vote', async (req, res) => {
  const { accid, id } = req.body;
  await DatabaseConnection.instance.setAccountVoted(accid, id);
  return sendJSON(res, { success: true, reason: 'Found username' });
});

/**
 * REST api on post on /ranking
 * body:
 * ```
 * {
 *     search: name // name of a cahracter to search for.
 *     job: number //id of the job to rank after.
 *     rank: number // contains what to rank after, fame or level.
 *     page: number // what page to load.
 *
 * }
 *```
 * response:
 * ```
 * {
 *     characters: Rank[] //List all character with its ranks.
 *     jobNames: string[] //List of names for all jobs of the characters in {characters}.
 * }
 * ```
 */
router.post('/ranking', async (req, res) => {
  const jobs = constants.getConstant('jobs');

  const { search, job, rank, page } = req.body;
  const ranks = await DatabaseConnection.instance.rank(rank.toLowerCase(), { job: parseInt(job, 10), search }, page, 5);
  const jobNames: string[] = [];
  for (let i = 0; i < ranks.length; i++) {
    const jobName = jobs[ranks[i].job];
    jobNames.push(!jobName ? '?' : jobName);
  }
  return sendJSON(res, { characters: ranks, jobNames });
});

router.post('/search', () => {
  /*
    let search = req.body.search;
    if(search.length == 0)
    return res.send(JSON.stringify({empty:"search for a word"}));
    let cat = req.body.category;
    let menus = ["home","forum","vote","play","ranking","sign up","login"];
    let sql_players = `SELECT name FROM characters WHERE name LIKE'%${search}%'`;

    if(cat == 'menu' || cat == 'all')
    //let sql_items = `SELECT name FROM characters WHERE name like ${search}`;
    mysql.connection.query(sql_players,(err,result)=>
    {
        if(err) throw err;
        res.send(JSON.stringify({players:result,pages:menus.filter(w=>w.includes(search))}));

    });
    */
});

router.get('/ranking/:player', (req, res, next) => {
  next();
});

router.use((req, res, next) => {
  const { session } = req;
  if (!isLoggedIn(session) || !isWebAdmin(session))
    return res.send(JSON.stringify({ error: 'Access denied', success: false }));
  next();
});

router.get('/logs', async (req, res) => {
  try {
    return res.send(JSON.stringify(await io.getLogs()));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});

router.delete('/logs', async (req, res) => {
  const { key } = req.body;
  try {
    await io.removeLog(key);
    return res.send(JSON.stringify({ success: true }));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});

router.delete('/logs/all', async (req, res) => {
  try {
    await io.removeAllLogs();
    return res.send(JSON.stringify({ success: true }));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});
router.get('/reports', async (req, res) => {
  try {
    return res.send(JSON.stringify(await io.getReports()));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});

router.delete('/reports', async (req, res) => {
  const { key } = req.body;
  try {
    await io.removeReport(key);
    return res.send(JSON.stringify({ success: true }));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});

router.delete('/reports/all', async (req, res) => {
  try {
    await io.removeAllReports();
    return res.send(JSON.stringify({ success: true }));
  } catch (err) {
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});

router.use((req, res, next) => {
  const { session } = req;
  if (!isAdmin(session))
    return res.send(JSON.stringify({ error: 'Access denied', success: false }));
  next();
});

router.post('/reports/ban', async (req, res) => {
  const { victimid, ban } = req.body;

  try {
    await io.handleReport(victimid, ban);
    return res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err);
    return res.send(JSON.stringify({ success: false, error: err.getMessage() }));
  }
});
export default router;
