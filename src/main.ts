const http = require('http');
const req = require('require-yml');
const LogUtils = require('./utils/log_utils');
const MapUtils = require('./utils/map_utils');
const ParmUtils = require('./utils/parm_utils');
const ErrorHandler = require('./error/error_handler');
const IdUtils = require('./utils/id_utils');
import BusinessException from './error/business_exception';
const WebSocket = require('ws');
var config = require('./config');
var global = require('./global');
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
        ErrorHandler.initErrorHandler();
        this.initConfig();
        this.initLog();
        this.initWebSocket();
        this.initWebSocketListening();
        this.initWebSocketHeartbeat();
    }

    initConfig() {
        console.log('initConfig...');
        let configPath = ParmUtils.getParm('-c');
        if (!configPath || configPath === '') {
            throw new BusinessException('configPath不能为空!', 0);
        }
        let configObj = req(configPath);
        if (!configObj) {
            throw new BusinessException('config解析有误,请检查路径是否正确!', 0);
        }
        config.set(configObj);
        global.put('uuid', configObj.uuid);
    }

    initLog() {
        console.log('initLog...');
        LogUtils.initLog();
    }

    initWebSocket() {
        console.log('initWebSocket...');
        const log = LogUtils.getLog('main.ts');
        const ws = new WebSocket(`ws://${config.get().server}:${config.get().port}`);
        ws.on('open', async () => {
            let agent: Agent = await new AgentServiceImpl().register();
            let req: Request = {
                id: IdUtils.getId(),
                target: '/register',
                from: null,
                type: 'json',
                encode: 'utf-8',
                header: MapUtils.mapToJson(global.getHeader()),
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
        global.setSocketClient(ws);
    }

    initWebSocketListening() {
        console.log('initWebSocketListening...');
        const log = LogUtils.getLog('main.ts');
        const isStopInterval = setInterval(() => {
            let client = global.getSocketClient();
            if (client.readyState !== 1) {
                global.setSocketClient(null);
                this.initWebSocket();
            }
        }, 30000);
    }

    initWebSocketHeartbeat() {
        console.log('initWebSocketHeartbeat...');
        const log = LogUtils.getLog('main.ts');
        const isStopInterval = setInterval(() => {
            let client = global.getSocketClient();
            if (client.readyState === 1) {
                let req: Request = {
                    id: IdUtils.getId(),
                    target: '/heartbeat',
                    from: '',
                    type: 'json',
                    encode: 'utf-8',
                    header: MapUtils.mapToJson(global.getHeader()),
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