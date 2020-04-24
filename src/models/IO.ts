import DatabaseConnection from "../core/database/DatabaseConnection";
import {AccountsInterface} from "../core/Interfaces/DatabaseInterfaces";

const Database = DatabaseConnection.getInstance();

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
     * @param username the username of the account
     * @param password the password of the account.
     */
    async login(username: string, password: string) : Promise<SessionInterface> {
        let account = await Database.getAccountWithPassword(username,password);
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
            return response;
        }
        return response
    }

    /**
     * registers a user and stores it into the databse.
     * if error occured, return.success will be false and
     * return.errorMessage will be filled with the reason why.
     * @param username the username of the account
     * @param password the password of the account.
     */
    async register(username: string, password: string, date : Date, email: string) {

    }
}