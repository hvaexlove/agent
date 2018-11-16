const os = require('os');
const shell = require('shelljs');
const fs = require("fs");
import { AgentService } from '../agent_service';
import { Agent } from '../../model/agent_model';
import { ExecScript } from '../../model/exec_script_model';
import { Request } from '../../protocol/service';
import BaseService from '../base_service';
import { getSocketClient, getConfig, getHeaders } from '../../global';
import { getId } from '../../utils/id_utils';
import { getLog } from '../../utils/log_utils';
import { get } from '../../utils/http_utils';
import { mapToJson, jsonToMap } from '../../utils/map_utils';

class AgentServiceImpl extends BaseService implements AgentService {

    private log: any = getLog('agent_service_impl.ts');

    constructor() {
        super();
    }

    public async register(): Promise<any>{
        let ip: string = await this.getIp();
        let agent: Agent = {
            uuid: getConfig().uuid,
            status: 1,
            host_name: os.hostname(),
            os_type: os.type(),
            os_platform: os.platform(),
            os_arch: os.arch(),
            os_version: os.release(),
            os_totalmem: os.totalmem(),
            version: 'v1.0.0',
            ip: ip
        };
        return agent;
    }

    public async execScript(req: Request): Promise<any>{
        let execScript: ExecScript = JSON.parse(req.body);
        let dir: string = os.tmpdir();
        let filePath: string = `${dir}/${getId()}`;
        fs.writeFileSync(filePath, execScript.script, {
            mode: 755
        });
        this.log.info('this log is execScript path: ', filePath);
        let result: string = null;
        try {
            let resultExec = shell.exec(filePath, {
                silent: true
            });
            let resultError = resultExec.stderr;
            let resultSuccess = resultExec.stdout;
            if(resultError && resultError != '') {
                result = resultError;
            } else if (resultSuccess && resultSuccess != '') {
                result = resultSuccess;
            }
            this.log.info('this log is execScript resultSuccess: ', resultSuccess);
            this.log.info('this log is execScript resultError: ', resultError);
            this.log.info('this log is execScript result: ', result);
        } catch (error) {
            this.log.error('this log is execScript error: ', error.message);
            result = error.message;
        }
        this.report(result, req);
        return result;
    }

    public async report(result: string, req: Request) {
        let socket: any = getSocketClient();
        let msg: Request = {
            id: getId(),
            req_id: req.id,
            target: '/report',
            from: null,
            type: 'json',
            encode: 'utf-8',
            header: mapToJson(getHeaders()),
            headerMap: null,
            body: JSON.stringify({result: result}),
            version: 'v1.0',
            timeout: 3000
        }
        this.log.info(JSON.stringify(msg));
        socket.send(JSON.stringify(msg));
    }

    private async getIp(): Promise<any> {
        let response: any = await get("http://pv.sohu.com/cityjson?ie=utf-8");
        if (response.res.statusCode === 200) {
            let ip: string = response.res.text;
            ip = ip.replace('var returnCitySN = ', '');
            ip = ip.replace(';', '');
            let ipObj = JSON.parse(ip);
            return ipObj.cip;
        } else {
            return null;
        }
        
    }

}

export default AgentServiceImpl;