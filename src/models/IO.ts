import DatabaseConnection from '../core/database/DatabaseConnection';
import { AccountsInterface, VotingInterface } from '../core/Interfaces/DatabaseInterfaces';

export interface SessionInterface {
  lifetime: number;
  expire: Date;
  account: AccountsInterface;
  REST: {
    loggedin: boolean;
    success: boolean;
    reason: string;
  };
}

export default class IO {
  /**
   * tries to login the user if username and password matches.
   * otherwise false it returned.
   * @param session current session to bind active login to.
   * @param username the username of the account
   * @param password the password of the account.
   */
  async login(session: Express.Session, username: string, password: string): Promise<SessionInterface> {
    let account;
    try {
      account = await DatabaseConnection.getInstance().getAccountWithPassword(username, password);
    } catch (err) {
      account = null;
    }
    const response = {
      lifetime: 0,
      expire: null,
      account,
      REST: {
        loggedin: false,
        success: false,
        reason: 'Wrong username or password!',
      },
    };

    if (account) {
      response.REST.success = true;
      response.REST.loggedin = true;
      const hour = 3600000 / 2;
      response.expire = new Date(Date.now() + hour);
      response.lifetime = hour;
      response.REST.reason = 'Login successful!';
      this.loginUserToSession(session, account, response.expire, response.lifetime);
      return response;
    }
    return response;
  }

  async getLogs() {
    return DatabaseConnection.instance.getLogs();
  }

  async removeLog(id: string) {
    return DatabaseConnection.instance.removeLog(id);
  }

  async removeAllLogs() {
    return DatabaseConnection.instance.removeAllLogs();
  }

  async getReports() {
    return DatabaseConnection.instance.getLogs();
  }

  async removeReport(victimid: number) {
    return DatabaseConnection.instance.removeReports(victimid);
  }

  async removeAllReports() {
    return DatabaseConnection.instance.removeAllReports();
  }

  async handleReport(id: number, ban: boolean) {
    return DatabaseConnection.instance.handleReports(id, ban);
  }

  private loginUserToSession(session: Express.Session, account: AccountsInterface, expire: Date, maxAge: number) {
    session.user = account;
    session.cookie.expires = expire;
    session.cookie.maxAge = maxAge;
  }

  /**
   * registers a user and stores it into the database.
   * if error occured, return.success will be false and
   * return.errorMessage will be filled with the reason why.
   * @param username the username of the account
   * @param password the password of the account.
   */
  async register(
    session: Express.Session,
    username: string,
    password: string,
    date: Date,
    email: string
  ): Promise<SessionInterface> {
    let accountId: number;
    let account: AccountsInterface;
    try {
      accountId = await DatabaseConnection.getInstance().addAccount(username, password, date, email);
      account = await DatabaseConnection.getInstance().getAccountById(accountId);
    } catch (err) {
      return {
        lifetime: 0,
        expire: null,
        account: null,
        REST: {
          loggedin: false,
          success: false,
          reason: err.message,
        },
      };
    }

    const response = {
      lifetime: 0,
      expire: null,
      account: null,
      REST: {
        loggedin: false,
        success: false,
        reason: 'Wrong username or password!',
      },
    };
    if (account) {
      response.REST.success = true;
      response.REST.loggedin = true;
      response.account = account;
      const hour = 3600000 / 2;
      response.expire = new Date(Date.now() + hour);
      response.lifetime = hour;
      this.loginUserToSession(session, account, response.expire, response.lifetime);
    }
    return response;
  }
}
