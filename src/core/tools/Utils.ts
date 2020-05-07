export interface Callable {
  call(prevRet: { err: boolean; value: any }): Promise<{ err: boolean; value: any }>;
}

export interface CallableCallback<A, R> extends Callable {
  callback(): (A) => R;
}

const T_KEY = 45433;
const V_KEY = 45434;
interface FuncPropertyValue {
  TransformKey: number;
  value(): any;
}

export interface WaitFor {
  TransformKey: number;
  callback(...inArgs: any[]): any;
}

export interface PreviousReturnValue {
  TransformKey: number;
  get(): string;
}

export async function pipe(...pipes: Callable[]): Promise<{ err: boolean; value: any }> {
  let prevRet = { err: false, value: null };
  for (let i = 0; i < pipes.length; i++) {
    try {
      const pipeChild = pipes[i];
      // eslint-disable-next-line no-await-in-loop
      prevRet = await pipeChild.call(prevRet);
    } catch (err) {
      return err;
    }
  }
  return prevRet;
}

export class AsyncPropertyFunction implements Callable {
  private func: Function;

  private properties: any[];

  private waitForIndex: { index: number; waitFor: WaitFor };

  private previousReturnValues: { index: number; previousReturn: PreviousReturnValue }[] = [];

  private stopError: boolean = false;

  constructor(func: Function) {
    this.func = func;
  }

  props(...properties: any[]): AsyncPropertyFunction {
    this.properties = properties;
    this.parseProps();
    return this;
  }

  private parseProps(): void {
    for (let i = 0; i < this.properties.length; i++) {
      const prop = this.properties[i];
      if (prop.TransformKey && prop.TransformKey === T_KEY) {
        this.waitForIndex = {
          index: i,
          waitFor: prop,
        };
      }
      if (prop.TransformKey && prop.TransformKey === V_KEY) {
        this.previousReturnValues.push({
          index: i,
          previousReturn: prop,
        });
      }
    }
  }

  stopOnError(): AsyncPropertyFunction {
    this.stopError = true;
    return this;
  }

  async call(prev: { err: boolean; value: any }): Promise<{ err: boolean; value: any }> {
    let previousReturnValue = prev;
    return new Promise<{ err: boolean; value: any }>((resolve, reject) => {
      if (this.waitForIndex) {
        this.properties[this.waitForIndex.index] = (...args: any[]) => {
          try {
            previousReturnValue = { err: false, value: this.waitForIndex.waitFor.callback(...args) };
          } catch (err) {
            if (this.stopError) {
              const ret: any = { err: true, value: err };
              reject(ret);
            }
            previousReturnValue = { err: true, value: err };
          }
          resolve(previousReturnValue);
        };
      }

      if (this.previousReturnValues) {
        for (let i = 0; i < this.previousReturnValues.length; i++) {
          const value = this.previousReturnValues[i];
          this.properties[value.index] = previousReturnValue.value[value.previousReturn.get()];
        }
      }

      const ret = this.func(...this.properties);
      if (!this.waitForIndex) {
        resolve(ret);
      }
    });
  }
}

export function waitFor(func: (...args: any[]) => any): WaitFor {
  const result: WaitFor = {
    TransformKey: T_KEY,
    callback(...inArgs: any[]): any {
      return func(inArgs);
    },
  };
  return result;
}

export function previousReturn(key: string): PreviousReturnValue {
  return {
    TransformKey: V_KEY,
    get(): string {
      return key;
    },
  };
}

export function fun(func: Function): AsyncPropertyFunction {
  return new AsyncPropertyFunction(func);
}
