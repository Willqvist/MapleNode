const FETCH_DATA = {
  method: 'POST',
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow',
  referrerPolicy: 'no-referrer',
};

function handleJsonFetch(response) {
  if(response.ok) {
    return response.json();
  }
  throw new Error(`Access denied: ${response.statusText}`);
}

export default class Http {
  static POST(url, callback) {
    if (!callback) return new Promise((resolve) => Http.request(url, 'POST', resolve));
    return Http.request(url, 'POST', callback);
  }

  static GET(url, callback) {
    if (!callback) return new Promise((resolve) => Http.request(url, 'GET', resolve));
    return Http.request(url, 'GET', callback);
  }

  static async UPLOAD(url, file, observer) {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.upload.onloadend = function(av) {observer.done();};
      xhr.upload.onprogress =  function(ev) {
        console.log(ev.loaded, ev.total);
        if(ev.lengthComputable) {
          return observer.progress(ev.loaded/ev.total);
        }
        return observer.progress(-1);
      };
      xhr.upload.onloadstart = function(av) {observer.begin();};
      xhr.open("PUT", url.getFullUrl(), true);
      xhr.send(formData);
    })
  }

  static request(url, type, callback) {
    FETCH_DATA.method = type;
    FETCH_DATA.body = JSON.stringify(url.getParamters());
    fetch(url.getFullUrl(),FETCH_DATA).then((response) => handleJsonFetch(response)).then(callback).catch((err)=>{
      callback({error:true, reason: err});
    });
  }
}
