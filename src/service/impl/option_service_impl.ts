import { AgentService } from '../agent_service';
import { OptionService } from '../option_service';
import { Request } from '../../protocol/service';
import BaseService from '../base_service';
import AgentServiceImpl from './agent_service_impl';
const config = require('../../config');
const LogUtils = require('../../utils/log_utils');

class OptionServiceImpl extends BaseService implements OptionService {

    private log: any = LogUtils.getLog('option_service_impl.ts');
    private agentService: AgentService = new AgentServiceImpl();

    constructor() {
        super();
    }

    public async action(req: Request): Promise<any>{
        switch (req.target) {
            case '/execScript':
                this.agentService.execScript(req);
            break;
        }
        return null;
    }

}

export default OptionServiceImpl;