/*
 * --------------------------------------------------------------------------------------------
 * Original work Copyright (c) Microsoft Corporation. All rights reserved.
 * Modified work Copyright (c) Alex C. Lewontin. All rights reserved.
 * See LICENSE for license information.
 * ------------------------------------------------------------------------------------------ */

import { TextDocument } from 'vscode-languageserver-textdocument';
import {
	createConnection,
	TextDocuments,
	CompletionParams,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	MarkupKind
} from 'vscode-languageserver/node';
import { URI } from 'vscode-uri';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
let symMap: Map<string, Map<string, string> > = new Map();


let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
	hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			hoverProvider: true,
			completionProvider: {
				resolveProvider: true,
				triggerCharacters: ['$']
			}
		}
	};
});

connection.onInitialized(() => {
	if (hasConfigurationCapability) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (hasWorkspaceFolderCapability) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}
});

documents.onDidChangeContent(async change => {
	symMap.delete(change.document.uri);
	let path = require('path');
	let dir = path.dirname(URI.parse(change.document.uri).fsPath);
	const { exec } = require('child_process');
	await new Promise(r => setTimeout(r, 1000));
	exec(`make --directory=${dir} -p -n`, async (_error: Error, _stdout: string) => {
		connection.console.log(`Parsing symbols for ${change.document.uri}`);
		symMap.set(change.document.uri, await parseSymbols(_stdout));
	});

});

async function parseSymbols(_data: string) {
	let syms: Map<string, string> = new Map();
	let search_pattern = /^([^#]*?)(:=|=)(.*?)$/gm;
	let match = search_pattern.exec(_data);
	let num_match = 0;
	while(match) {
		num_match++;
		syms.set(match[1].trim(), match[3].trim()); 
		match = search_pattern.exec(_data);
	}

	connection.console.log(`Found ${num_match} total matches.`);

	return syms;
}

connection.onHover(async (_params: TextDocumentPositionParams) => {
	let doc = documents.get(_params.textDocument.uri);
	if(!doc) { return { contents : [] }; }

	let line = doc.getText().split('\n')[_params.position.line];
	//let line = text.getText().split('\n')[_params.position.line];
	connection.console.log(`Hovering on (${_params.position.line}, ${_params.position.character}): ${line}`);

	let phrase = getWordAt(line, _params.position.character);
	connection.console.log(`Extracted: [${phrase}]`);

	let syms = symMap.get(_params.textDocument.uri);
	if(!syms) {
		await new Promise(r => setTimeout(r, 1000));
		syms = symMap.get(_params.textDocument.uri);
		if(!syms) { return { contents : [] }; }
	}

	let def = syms.get(phrase);

	if(!def) { 
		return { contents : [] }; }
	else {
		return { contents: {
			kind: MarkupKind.Markdown,
			value: [
				'```makefile',
				def,
				'```'
			].join('\n')
		}}
	}
});

function getWordAt (_str: string, _pos: number) {

    // Search for the word's beginning and end.
    var left = _str.slice(0, _pos + 1).search(/[^\s=:\(]+$/),
        right = _str.slice(_pos).search(/[\s=:\)]/);

    // The last word in the string is a special case.
    if (right < 0) { return _str.slice(left); }

    // Return the word, using the located bounds to extract it from the string.
    return _str.slice(left, right + _pos);

}
// This handler provides the initial list of the completion items.
connection.onCompletion((_completionInfo: CompletionParams): CompletionItem[] => {

	let vars = require("../data/variables.json");

	if (_completionInfo.context && _completionInfo.context.triggerCharacter === '$') {
		vars.forEach((value: any) => { value.insertText = value.data.refInsertText; });
	} else {
		vars = vars.filter((value: any) => { return (value.data.defInsertText); });
		vars.forEach((value: any) => { value.insertText = value.data.defInsertText; });
	}
	return vars;

});

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((_item: CompletionItem): CompletionItem => {

	let docs = require("../data/documentation.json");
	_item.documentation = docs[_item.data.def].documentation;
	return _item;

});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
