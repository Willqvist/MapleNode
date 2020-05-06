import { AccountsInterface } from '../core/Interfaces/DatabaseInterfaces';
import DatabaseConnection from '../core/database/DatabaseConnection';

export function getAccount(session: Express.Session): AccountsInterface {
  return <AccountsInterface>session.user;
}

export async function getAccountByName(name: string): Promise<AccountsInterface> {
  return DatabaseConnection.instance.getAccount(name);
}

export function isLoggedIn(session: Express.Session): boolean {
  return session.user;
}

export function isAdmin(session: Express.Session): boolean {
  return this.getAccount(session).gm >= 1;
}

export function isWebAdmin(session: Express.Session): boolean {
  return this.getAccount(session).webadmin >= 1;
}
