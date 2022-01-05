import * as vscode from 'vscode';
import RandExp from 'randexp';

const languages = ['javascript', 'typescript', 'coffeescript', 'ruby', 'groovy'];
const numPreviews = 5;
const regexRegex = /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/[gimusy]*/; // so:17843691

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
	// Get content of line
	const range = document.getWordRangeAtPosition(position, regexRegex);
	const match = document.getText(range);
	// Exit if no regex selected
	if (match.includes('\n')) return;
	// Create preview regexes
	const previews: string[] = [];
	for (let i = 0; i < numPreviews; i++) {
		const annotation = new RandExp(eval(match));
		annotation.max = 10;
		const preview = annotation.gen();
		if (!previews.includes(preview)) {
			previews.push(preview);
		}
	}
	// Return
	const previewText = previews.map(text => '\n- `` ' + text + ' ``').join('');
	const result = new vscode.MarkdownString(`**Possible matches:**\n${previewText}`);
	return new vscode.Hover(result);
}

for (const language of languages) {
	vscode.languages.registerHoverProvider(language, { provideHover: provideHover });
}
