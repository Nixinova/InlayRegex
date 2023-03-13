import * as vscode from 'vscode';
import RandExp from 'randexp';

const supportedLanguages = [
	// languages with regex literals
	'javascript',
	'javascriptreact',
	'typescript',
	'typescriptreact',
	'coffeescript',
	'ruby',
	'groovy',
];

const REGEX_MATCHER = new RegExp(`
	(?<!<) ${/* dont match HTML e.g. '<a>b</a>' */''}
	\\/
	(
		(?! [*+?] ) ${/* dont match block comments */''}
		(?:
			[^\\r\\n\\[\\/\\\\] ${/* match non-escapes and non-groups */''}
			|
			\\\\. ${/* match escapes e.g. '\s' */''}
			|
			\\[
			(?:
				[^\\r\\n\\]\\\\]
				|
				\\\\.
			)*
			\\]
		)+
	)
	\\/
	[gimusy]*
	`.replace(/\s/g, '')
);

const NUM_MATCHES = 5; // number of matches shown in hover window
const MAX_NUM_TRIES = 20; // number of times to try create non-duplicate matches before giving up

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
	// Get content of line
	const range = document.getWordRangeAtPosition(position, REGEX_MATCHER);
	const match = document.getText(range);
	const [, matchContent, matchFlags] = match.split('/');
	// Exit if no regex selected
	if (match.includes('\n')) return;
	// Create preview regexes
	const previews: string[] = [];
	for (let i = 0; previews.length < NUM_MATCHES && i < MAX_NUM_TRIES; i++) {
		const annotation = new RandExp(new RegExp(matchContent, matchFlags));
		annotation.max = NUM_MATCHES;
		const preview = annotation.gen();
		if (!previews.includes(preview)) {
			previews.push(preview);
		}
	}
	// Return
	const previewText = previews.map(text => '\n- `` ' + text + ' ``').join('');
	const outputText = `**Sample matches:**\n${previewText}`;
	const result = new vscode.MarkdownString(outputText);
	return new vscode.Hover(result);
}

// Activate extension
for (const language of supportedLanguages) {
	vscode.languages.registerHoverProvider(language, { provideHover: provideHover });
}
