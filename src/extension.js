const vscode = require('vscode');
const { viewReport } = require('./viewer.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('viztracer.vizviewer', function (resource) {
		viewReport(resource.fsPath);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
