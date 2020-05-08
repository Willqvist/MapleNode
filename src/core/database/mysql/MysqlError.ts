type ErrorObject = { errno: number; msg: string };

export default class MysqlError extends Error {
  private errorObj: ErrorObject;

  constructor(error: ErrorObject) {
    super('');
    this.errorObj = error;
  }

  getMessage(): string {
    return this.errorObj.msg;
  }

  getErrorCode(): number {
    return this.errorObj.errno;
  }

  getErrorObject(): ErrorObject {
    return this.errorObj;
  }
}
