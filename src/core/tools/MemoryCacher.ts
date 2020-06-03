export default class MemoryCacher {
  private data: { [key: string]: any } = {};

  private timeouts: { [key: string]: NodeJS.Timeout } = {};

  add(key: string, value: any, lifetime: number) {
    this.data[key] = value;
    this.addTimeout(key, lifetime);
  }

  get(key: string): any {
    return this.data[key];
  }

  exists(key: string): boolean {
    return this.data[key] !== null;
  }

  remove(key: string) {
    this.deleteKey(key);
  }

  private addTimeout(key: string, lifetime: number) {
    this.timeouts[key] = setTimeout(() => this.deleteKey(key), lifetime);
  }

  private deleteKey(key) {
    this.data[key] = null;
    if (!this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
      this.timeouts[key] = null;
    }
  }
}
