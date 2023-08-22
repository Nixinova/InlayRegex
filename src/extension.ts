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

const REGEX_MATCHER = new RegExp(String.raw`
	(?<! < ) ${/* dont match HTML e.g. the '/><br/' of '<br/><br/>' */''}
	\/
	(
		(?! \* ) ${/* dont match block comments e.g. '/*' */''}
		(?:
			${/* match anything other than whitespace, escapes or groups */''}
			[^\r\n\[\/\\]
		|
			${/* match escapes e.g. '\s' */''}
			\\.
		|
			${/* match groups e.g. '[abc]' */''}
			\[
			(?:
				[^\r\n\]\\]
			|
				\\.
			)*
			\]
		)+
	)
	\/
	[gimusy]*
	`.replace(/\s/g, '')
);

/** Number of matches shown in hover window. */
const NUM_MATCHES = 5;
/** Number of times to try create non-duplicate matches before giving up. */
const MAX_NUM_TRIES = 20;

function provideHover(document: vscode.TextDocument, position: vscode.Position) {
	// Get content of line
	const range = document.getWordRangeAtPosition(position, REGEX_MATCHER);
	const match = document.getText(range);
	const [, matchContent, matchFlags] = match.split('/');
	// Exit if no regex selected
	if (match.includes('\n'))
		return;
	// Create preview regexes
	const previews: string[] = [];
	for (let i = 0; previews.length < NUM_MATCHES && i < MAX_NUM_TRIES; i++) {
		// Generate preview match string
		const annotation = new RandExp(matchContent, matchFlags);
		annotation.max = NUM_MATCHES;
		const preview = annotation.gen();
		// Add string to list if it is not a duplicate
		if (!previews.includes(preview)) {
			previews.push(preview);
		}
	}
	// Return match strings
	const previewText = previews.map(text => '\n- `` ' + text + ' ``').join('');
	const outputText = `**Sample matches:**\n${previewText}`;
	const result = new vscode.MarkdownString(outputText);
	return new vscode.Hover(result);
}

// Activate extension
for (const language of supportedLanguages) {
	vscode.languages.registerHoverProvider(language, { provideHover: provideHover });
}
