const superagent = require('superagent');

exports.get = (url: string) => {
    return superagent
    .get(url);
}

exports.post = (url: string, body: any) => {
    return superagent
    .post(url)
    .send(body);
}