const vscode = require('vscode');
const { viewReport } = require('./viewer.js');
const { trace } = require('./tracer.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	context.subscriptions.push(
		vscode.commands.registerCommand('viztracer.view', function (resource) {
			viewReport(resource.fsPath);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('viztracer.trace', function (resource) {
			trace(resource.fsPath);
		})
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
