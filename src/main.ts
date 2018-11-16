const http = require('http');
const req = require('require-yml');
const WebSocket = require('ws');
import { initLog4js, getLog } from './utils/log_utils';
import { mapToJson, jsonToMap } from './utils/map_utils';
import { getParm } from './utils/parm_utils';
import { initErrorHandler } from './error/error_handler';
import { getId } from './utils/id_utils';
import BusinessException from './error/business_exception';
import { setSocketClient, getSocketClient, putHeader, getHeader, getHeaders, setConfig, getConfig } from './global';
import { Request } from './protocol/service';
import AgentServiceImpl from './service/impl/agent_service_impl';
import { AgentService } from './service/agent_service';
import OptionServiceImpl from './service/impl/option_service_impl';
import { OptionService } from './service/option_service';
import { Agent } from './model/agent_model';

class Main {

    constructor() {
        this.init();
    }

    init() {
        console.log('Agent v1.0.0');
        console.log('Copyright (c) 2018 Agent Inc.');
        initErrorHandler();
        this.initConfig();
        this.initLog();
        this.initWebSocket();
        this.initWebSocketListening();
        this.initWebSocketHeartbeat();
    }

    initConfig() {
        console.log('initConfig...');
        let configPath = getParm('-c');
        if (!configPath || configPath === '') {
            throw new BusinessException('configPath不能为空!', 0);
        }
        let configObj = req(configPath);
        if (!configObj) {
            throw new BusinessException('config解析有误,请检查路径是否正确!', 0);
        }
        setConfig(configObj);
        putHeader('uuid', configObj.uuid);
    }

    initLog() {
        console.log('initLog...');
        initLog4js();
    }

    initWebSocket() {
        console.log('initWebSocket...');
        const log = getLog('main.ts');
        const ws = new WebSocket(`ws://${getConfig().server}:${getConfig().port}`);
        ws.on('open', async () => {
            let agent: Agent = await new AgentServiceImpl().register();
            let req: Request = {
                id: getId(),
                target: '/register',
                from: null,
                type: 'json',
                encode: 'utf-8',
                header: mapToJson(getHeaders()),
                headerMap: null,
                body: JSON.stringify(agent),
                version: 'v1.0',
                timeout: 3000
            };
            log.info(JSON.stringify(req));
            ws.send(JSON.stringify(req));
        });
          
        ws.on('message', (req: string) => {
            let msg: Request = JSON.parse(req);
            let option: OptionService = new OptionServiceImpl();
            log.info('this log is onMessage: ', msg);
            option.action(msg);
        });

        ws.on('close', () => {
            log.info('disconnected');
        });
        setSocketClient(ws);
    }

    initWebSocketListening() {
        console.log('initWebSocketListening...');
        const log = getLog('main.ts');
        const isStopInterval = setInterval(() => {
            let client = getSocketClient();
            if (client.readyState !== 1) {
                setSocketClient(null);
                this.initWebSocket();
            }
        }, 30000);
    }

    initWebSocketHeartbeat() {
        console.log('initWebSocketHeartbeat...');
        const log = getLog('main.ts');
        const isStopInterval = setInterval(() => {
            let client = getSocketClient();
            if (client.readyState === 1) {
                let req: Request = {
                    id: getId(),
                    target: '/heartbeat',
                    from: '',
                    type: 'json',
                    encode: 'utf-8',
                    header: mapToJson(getHeaders()),
                    headerMap: null,
                    body: '',
                    version: 'v1.0',
                    timeout: 3000
                };
                client.send(JSON.stringify(req));
            }
        }, 10000);
    }

}

new Main();