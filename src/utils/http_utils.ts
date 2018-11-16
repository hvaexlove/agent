const superagent = require('superagent');

let get = (url: string) => {
    return superagent
    .get(url);
}

let post = (url: string, body: any) => {
    return superagent
    .post(url)
    .send(body);
}

export {
    get, post
}