let socketClient: any = null;
let headerMap: Map<string, any> = new Map<string, any>();

module.exports.setSocketClient = (client: any) => {
    socketClient = client;
}

module.exports.getSocketClient = () => {
    return socketClient;
}

module.exports.put = (key: string, value: any) => {
    headerMap.set(key, value);
}

module.exports.get = (key: string) => {
    return headerMap.get(key);
}

module.exports.getHeader = () => {
    return headerMap;
}