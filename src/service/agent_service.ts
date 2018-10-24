import { Agent } from '../model/agent_model';
import { Request } from '../protocol/service';

export interface AgentService {
    
    /**
     * agent register
     */
    register(): Promise<any>;

    /**
     * execScript req
     * @param req 执行脚本的请求
     */
    execScript(req: Request): Promise<any>;

}