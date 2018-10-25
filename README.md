<h1>Agent</h1>

<div align="center">

[![Build Status](https://travis-ci.org/hvaexlove/agent.svg?branch=master)](https://travis-ci.org/hvaexlove/agent)
[![Build status](https://ci.appveyor.com/api/projects/status/3792bpwm936rr19l/branch/master?svg=true)](https://ci.appveyor.com/project/hvaexlove/agent/branch/master)

</div>

<br />

基于nodejs开发的远程命令执行工具，可之间编译成windows、linux、macos跨平台应用。
linux、macos一键式安装应用。
上下线通知，agent-server实时监听agent是否上线。
agent-server与agent通过websocket实时通讯。
agent拥有断线重连机制。

### Install

```
git clone https://github.com/hvaexlove/agent.git
npm i
npm run repkg
```

## License

Licensed under [MIT](./LICENSE).