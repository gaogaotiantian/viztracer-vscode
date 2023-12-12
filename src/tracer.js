const vscode = require('vscode');
const fs = require('fs');
const { confirmVizTracerVersion } = require('./common.js');

function trace(filePath) {
    if (!fs.existsSync(filePath)) {
        vscode.window.showErrorMessage("source file does not exist");
        return;
    }

    confirmVizTracerVersion("0.16.1").then((pythonPath) => {
        if (pythonPath) {
            const config = vscode.workspace.getConfiguration('viztracer');

            const viztracerArguments = config.get('viztracerArguments');
            const scriptArguments = config.get('scriptArguments');
            const terminalToTrace = config.get('terminalToTrace');
            let terminal = null;

            if (terminalToTrace == 'Current Active') {
                terminal = vscode.window.activeTerminal;
            }

            if (!terminal) {
                terminal = vscode.window.createTerminal('VizTracer');
            }

            terminal.sendText(`${pythonPath} -m viztracer ${viztracerArguments} -- ${filePath} ${scriptArguments}`);
            terminal.show();
        }
    });
    
}

module.exports = {
    trace
}
