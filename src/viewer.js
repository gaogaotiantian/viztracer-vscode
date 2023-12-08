const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const { confirmVizTracerVersion} = require('./common.js');

function viewReport(reportPath)
{
    if (!fs.existsSync(reportPath)) {
        vscode.window.showErrorMessage("Report file does not exist");
        return;
    }
    confirmVizTracerVersion("0.16.1").then((pythonPath) => {
        if (pythonPath) {
            runVizViewer(pythonPath, reportPath, 9001);
        }
    });
}

function runVizViewer(pythonPath, reportPath, port)
{
    const process = spawn(pythonPath, ["-m", "viztracer.viewer", "-s", reportPath, "-p", port]);

    process.stdout.on('data', (data) => {
        const message = data.toString();
        const regex = /view your trace on (http:\/\/localhost:\d+)/g;
        let m = null;

        if (message.includes('No module named vizviewer')) {
            vscode.window.showErrorMessage("Please install vizviewer to view the report");
        } else if (m = regex.exec(message)) {
            let url = m[1];
            openInWebview(url, path.basename(reportPath), () => {
                process.kill();
            });
        } else if (message.includes('Traceback')) {
            vscode.window.showErrorMessage("Error occurred when viewing the report");
        } else if (message.includes('already in use')) {
            if (port < 9100) {
                runVizViewer(pythonPath, reportPath, port + 1);
            }
        }
    });

}

function openInWebview(url, title, closeCallback)
{
    const columnTwoVisible = vscode.window.tabGroups.all.some((group) => {
        return group.viewColumn == vscode.ViewColumn.Two;
    });

    const panel = vscode.window.createWebviewPanel(
        'VizTracer',
        title,
        columnTwoVisible ? vscode.ViewColumn.Two: vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.onDidReceiveMessage((message) => {
        if (message.type == 'viztracer') {
            if (message.action == 'openfile') {
                if (fs.existsSync(message.file)) {
                    vscode.workspace.openTextDocument(message.file).then((doc) => {
                        vscode.window.showTextDocument(doc, vscode.ViewColumn.One, true).then((editor) => {
                            let range = new vscode.Range(message.line - 1, 0, message.line - 1, 0);
                            editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
                        });
                    });
                } else {
                    vscode.window.showErrorMessage(`File ${message.file} does not exist`);
                }
            }
        }
    })

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body, html, iframe {
                    background-color: white;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
        </head>
        <body>
            <iframe src="${url}" id="iframe" frameborder="0" style="width:100%;height:100%;"></iframe>
            <script>
                var perfettoReady = false;
                var perfettoCheckRetry = 10;
                var perfettoCheckInterval = null;
                const vscode = acquireVsCodeApi();

                function checkPerfetto() {
                    if (perfettoReady || perfettoCheckRetry-- <= 0) {
                        window.clearInterval(perfettoCheckInterval);
                    } else {
                        document.getElementById("iframe").contentWindow.postMessage('PING', '*');
                    }
                }

                window.addEventListener('message', (event) => {
                    if (event.data.type == 'viztracer') {
                        perfettoReady = true;
                        if (event.data.action == 'openfile') {
                            vscode.postMessage(event.data);
                        }
                    }
                });

                window.onload = function() {
                    perfettoCheckInterval = window.setInterval(checkPerfetto, 1000);
                }

            </script>
        </body>
        </html>`

    panel.onDidDispose(closeCallback);
}

module.exports = {
    viewReport
};
