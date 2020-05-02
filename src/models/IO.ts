import DatabaseConnection from "../core/database/DatabaseConnection";
import {AccountsInterface, VoteInterface, VotingInterface} from "../core/Interfaces/DatabaseInterfaces";

export interface SessionInterface {
    lifetime:number,
    expire : Date,
    account:AccountsInterface
    REST:{
        loggedin:boolean,
        success:boolean,
        reason:string
    }
}

export default class IO {

    /**
     * tries to login the user if username and password matches.
     * otherwise false it returned.
     * @param session current session to bind active login to.
     * @param username the username of the account
     * @param password the password of the account.
     */
    async login(session : Express.Session,username: string, password: string) : Promise<SessionInterface> {
        let account;
        try {
            account = await DatabaseConnection.getInstance().getAccountWithPassword(username, password);
        } catch(err) {
            account = null;
        }
        let response = {
            lifetime:0,
            expire:null,
            account:account,
            REST:{
                loggedin:false,
                success:false,
                reason:"Wrong username or password!"
            }
        };

        if(account) {
            response.REST.success = true;
            response.REST.loggedin = true;
            let hour = 3600000/2;
            response.expire = new Date(Date.now() + hour);
            response.lifetime = hour;
            this.loginUserToSession(session,account,response.expire,response.lifetime);
            return response;
        }
        return response
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
    async register(session : Express.Session,username: string, password: string, date : Date, email: string) : Promise<SessionInterface> {
        let account : number;
        try {
            console.log("IM HERE");
            account = await DatabaseConnection.getInstance().addAccount(username, password, date, email);
        } catch(err) {
            console.log("IM HERE",err);
            return {
                lifetime:0,
                expire:null,
                account:null,
                REST:{
                    loggedin:false,
                    success:false,
                    reason:err.message
                }
            };
        }

        let response = {
            lifetime:0,
            expire:null,
            account:null,
            REST:{
                loggedin:false,
                success:false,
                reason:"Wrong username or password!"
            }
        };
        let acc : AccountsInterface = {
            id:account,
            name:username,
            password:password
        }
        if(response) {
            response.REST.success = true;
            response.REST.loggedin = true;
            response.account = acc;
            let hour = 3600000/2;
            response.expire = new Date(Date.now() + hour);
            response.lifetime = hour;
            this.loginUserToSession(session,acc,response.expire,response.lifetime);
        }
        return response;

    }

    /**
     * registers a vote for an account
     * @param accountId the account that has voted
     * @param voteId the id of the vote site.
     */
    async vote(accountId: number, voteId: number) {
        await DatabaseConnection.instance.setAccountVoted(accountId,voteId);
    }

    /**
     * returns all pages that account with account id has voted in within the cooldown
     * for that vote site.
     * @param accountId the account to get the vote sites from.
     */
    async getVotes(accountId: number): Promise<VotingInterface[]>  {
        return await DatabaseConnection.instance.getAccountVote(accountId);
    }

    getAccount(session: Express.Session) : AccountsInterface {
        return <AccountsInterface>session.user;
    }

    async getAccountByName(name: string) : Promise<AccountsInterface> {
        return await DatabaseConnection.instance.getAccount(name);
    }

    isLoggedIn(session: Express.Session): boolean {
        return session.user;
    }

    isAdmin(session: Express.Session): boolean {
        return this.getAccount(session).gm >= 1;
    }

    isWebAdmin(session: Express.Session): boolean {
        return this.getAccount(session).webadmin >= 1;
    }
}
