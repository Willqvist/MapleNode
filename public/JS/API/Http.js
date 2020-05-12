export default class Http {
  static POST(url, callback) {
    if (!callback) return new Promise((resolve) => Http.request(url, 'POST', resolve));
    return Http.request(url, 'POST', callback);
  }

  static GET(url, callback) {
    if (!callback) return new Promise((resolve) => Http.request(url, 'GET', resolve));
    return Http.request(url, 'GET', callback);
  }

  static request(url, type, callback) {
    const http = new XMLHttpRequest();
    http.open(type, url.getFullUrl(), true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () {
      if (http.readyState === XMLHttpRequest.DONE && http.status === 200) callback(JSON.parse(http.responseText));
      else if (http.readyState === XMLHttpRequest.DONE && http.status === 404)
        callback({ success: false, http: { status: http.status } });
    };
    http.send(JSON.stringify(url.getParamters()));
  }
}
