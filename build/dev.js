const fs = require("fs");
const { exec } = require('pkg');

(async() => {
    if(fs.existsSync('pkg/agent-linux')) {
        fs.unlinkSync('pkg/agent-linux');
    }
    if(fs.existsSync('pkg/agent-macos')) {
        fs.unlinkSync('pkg/agent-macos');
    }
    if(fs.existsSync('pkg/agent-win.exe')) {
        fs.unlinkSync('pkg/agent-win.exe');
    }
    await exec([ 'dist/main.js', '--out-path', 'pkg/']);
    await fs.renameSync('pkg/main-linux', 'pkg/agent-linux');
    await fs.renameSync('pkg/main-macos', 'pkg/agent-macos');
    await fs.renameSync('pkg/main-win.exe', 'pkg/agent-win.exe');
    console.log('build success!');
})();
