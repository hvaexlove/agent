let configObj: any = null;
let socketClient: any = null;
let headerMap: Map<string, any> = new Map<string, any>();


let setConfig = (config: object) => {
    configObj = config;
}

let getConfig = () => {
    return configObj;
}

let setSocketClient = (client: any) => {
    socketClient = client;
}

let getSocketClient = () => {
    return socketClient;
}

let putHeader = (key: string, value: any) => {
    headerMap.set(key, value);
}

let getHeader = (key: string) => {
    return headerMap.get(key);
}

let getHeaders = () => {
    return headerMap;
}

export {
    setSocketClient, getSocketClient, putHeader, getHeader, getHeaders, setConfig, getConfig
}