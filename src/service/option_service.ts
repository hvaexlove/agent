import { Request } from '../protocol/service';

export interface OptionService {
    
    /**
     * action 指令转发
     * @param req req内容
     */
    action(req: Request): Promise<any>;

}