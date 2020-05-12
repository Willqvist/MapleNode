export default class Url {
  constructor(url, parameters) {
    this.url = url;
    this.parameters = parameters;
  }

  getFullUrl() {
    return this.url;
  }

  getParamters() {
    return this.parameters;
  }

  parametersToString() {
    let parsedParameter = '';
    for (let i = 0; i < parsedParameter.length; i++) {
      const key = this.parameters[i];
      parsedParameter += `${key}=${this.parameters[key]}&`;
    }
    return parsedParameter.slice(0, -1);
  }
}
