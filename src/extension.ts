import * as vscode from 'vscode';
import RandExp from 'randexp';

export function activate(_ctx: vscode.ExtensionContext) {
	vscode.workspace.onWillSaveTextDocument(event => {
		const openEditor = vscode.window.visibleTextEditors.filter(
			editor => editor.document.uri === event.document.uri
		)[0];
		decorate(openEditor);
	});
}

const decorationType = vscode.window.createTextEditorDecorationType({});
function decorate(editor: vscode.TextEditor) {
	const sourceLines = editor.document.getText().split('\n');
	const decorations: vscode.DecorationOptions[] = [];
	const regex = /\/.*?[^\\]\/[gimusy]*/g;
	for (let l = 0; l < sourceLines.length; l++) {
		const line = sourceLines[l];
		const matches = line.matchAll(regex);
		const matchCount = line.match(regex)?.length ?? 0;
		for (const match of matches) {
			const displayInline = matchCount > 1 || line.length > 80;
			const range = new vscode.Range(
				new vscode.Position(l, displayInline ? match.index! : line.length - match[0].length),
				new vscode.Position(l, displayInline ? match.index! + match[0].length : line.length)
			);

			const annotation = new RandExp(eval(match[0]));
			annotation.max = 8;
			const annotationText = annotation.gen();

			const decoration: vscode.DecorationOptions = {
				range,
				renderOptions: {
					after: {
						contentText: annotationText,
						color: '#aaa',
						textDecoration: `
							margin: 0 3px;
							padding: 0 3px;
							font-size: 80%;
						`,
					},
				},
			};
			decorations.push(decoration);
		}
	}
	editor.setDecorations(decorationType, decorations);
}
