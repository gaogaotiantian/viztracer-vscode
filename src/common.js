const { spawn } = require('child_process');
const vscode = require('vscode');

function getViztracerVersion(pythonPath) {
    return new Promise((resolve) => {
        const process = spawn(pythonPath, ['-m', 'pip', 'show', 'viztracer']);
        let stdout = "";
        // wait until the process is finished
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.on('close', (code) => {
            // Get the stdout
            const regex = /Version: (\d+\.\d+\.\d+)/g;
            // Check if the stdout contains the version
            let m = regex.exec(stdout);

            if (m) {
                resolve(m[1]);
            } else {
                resolve(null);
            }
        });
    });
}

function showOptionsWithoutViztracer(message, pythonPath) {
    return new Promise((resolve) => {
        vscode.window.showWarningMessage(message, "Install VizTracer").then((selection) => {
            if (selection === "Install VizTracer") {
                const process = spawn(pythonPath, ['-m', 'pip', 'install', '-U', 'viztracer']);
                process.on('close', (code) => {
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    });
}

function versionAtLeast(version, target) {
    const versionParts = version.split(".");
    const targetParts = target.split(".");
    for (let i = 0; i < versionParts.length; i++) {
        if (i >= targetParts.length) {
            return true;
        }
        if (versionParts[i] > targetParts[i]) {
            return true;
        } else if (versionParts[i] < targetParts[i]) {
            return false;
        }
    }
    return true;
}

module.exports = {
    getViztracerVersion,
    showOptionsWithoutViztracer,
    versionAtLeast
};
