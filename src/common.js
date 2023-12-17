const { spawn } = require('child_process');
const vscode = require('vscode');

const { PythonExtension } = require('@vscode/python-extension');

function getViztracerVersion(pythonPath) {
    return new Promise((resolve) => {
        const process = spawn(pythonPath, ['-m', 'pip', 'show', 'viztracer']);
        let stdout = "";
        // wait until the process is finished
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        process.on('close', () => {
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
                process.on('close', () => {
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

function confirmVizTracerVersion(target) {
    return new Promise((resolve) => {
        PythonExtension.api().then((api) => {
            if (!api) {
                vscode.window.showErrorMessage("Please install Python extension to view the report");
                resolve(null);
            }

            const environmentPath = api.environments.getActiveEnvironmentPath();
            api.environments.resolveEnvironment(environmentPath).then((environment) => {
                getViztracerVersion(environment.path).then((version) => {
                    if (!version || !versionAtLeast(version, target)) {
                        let message = "Please upgrade VizTracer to view the report";
                        if (!version) {
                            message = "Please install VizTracer to view the report";
                        }
                        showOptionsWithoutViztracer(message, environment.path).then((installed) => {
                            if (installed) {
                                resolve(environment.path);
                            } else {
                                resolve(null);
                            }
                        });
                    } else {
                        resolve(environment.path);
                    }
                });
            });
        });
    });
}

/**
 * @param {string} path
 * @param {vscode.Terminal} terminal
 * @param {boolean} isCommand
 */
function escapeSpaces(path, terminal, isCommand) {
    if (path.includes(" ")) {
        // Double quote works for POSIX shell and cmd. On powershell, if
        // it's the arguments, it works as well.
        // shellPath is not available here so we used the terminal name.
        // It's not accurate, but it's better than nothing.
        if (!isCommand || process.platform !== "win32" ||
            terminal.name.toLowerCase().includes("cmd")) {
            return '"' + path + '"';
        }
        return path.replace(/ /g, "` ");
    }
    return path;
}

module.exports = {
    confirmVizTracerVersion,
    escapeSpaces
};
