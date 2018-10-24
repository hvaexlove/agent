export interface ExecScript {
    
    // 脚本内容
    script: string;

    // 参数
    parameters: Array<string>;
    
    // 执行超时
    timeout: number;

}