/*
 * --------------------------------------------------------------------------------------------
 * Original work Copyright (c) Microsoft Corporation. All rights reserved.
 * Modified work Copyright (c) Alex C. Lewontin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import {
	createConnection,
	TextDocuments,
	CompletionParams,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
} from 'vscode-languageserver';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we will fall back using global settings
	hasConfigurationCapability = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	hasDiagnosticRelatedInformationCapability = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			// Tell the client that the server supports code completion
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


// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_completionInfo: CompletionParams): CompletionItem[] => {
	
		let dict = [
			{
				label: '$@',
				insertText: '@',
				kind: CompletionItemKind.Variable,
				data: 1,
				sortText: '1'
			},
			{
				label: '$%',
				insertText: '%',
				kind: CompletionItemKind.Variable,
				data: 2,
				sortText: '2'
			},
			{
				label: '$<',
				insertText: '<',
				kind: CompletionItemKind.Variable,
				data: 3,
				sortText: '3'
			},
			{
				label: '$?',
				insertText: '?',
				kind: CompletionItemKind.Variable,
				data: 4,
				sortText: '4'
			},
			{
				label: '$^',
				insertText: '^',
				kind: CompletionItemKind.Variable,
				data: 5,
				sortText: '5'
			},
			{
				label: '$+',
				insertText: '+',
				kind: CompletionItemKind.Variable,
				data: 6,
				sortText: '6'
			},			
			{
				label: '$|',
				insertText: '|',
				kind: CompletionItemKind.Variable,
				data: 7,
				sortText: '7'
			},			
			{
				label: '$*',
				insertText: '*',
				kind: CompletionItemKind.Variable,
				data: 8,
				sortText: '8'
			},
			{
				label: '$(@D)',
				insertText: '(@D)',
				kind: CompletionItemKind.Variable,
				data: 9,
				sortText: '9'
			},
			{
				label: '$(@F)',
				insertText: '(@F)',
				kind: CompletionItemKind.Variable,
				data: 10,
				sortText: '10'
			},
			{
				label: '$(%D)',
				insertText: '(%D)',
				kind: CompletionItemKind.Variable,
				data: 11,
				sortText: '11'
			},
			{
				label: '$(%F)',
				insertText: '(%F)',
				kind: CompletionItemKind.Variable,
				data: 12,
				sortText: '12'
			},
			{
				label: '$(*D)',
				insertText: '(*D)',
				kind: CompletionItemKind.Variable,
				data: 13,
				sortText: '13'
			},
			{
				label: '$(*F)',
				insertText: '(*F)',
				kind: CompletionItemKind.Variable,
				data: 14,
				sortText: '14'
			},
			{
				label: '$(<D)',
				insertText: '(<D)',
				kind: CompletionItemKind.Variable,
				data: 15,
				sortText: '15'
			},
			{
				label: '$(<F)',
				insertText: '(<F)',
				kind: CompletionItemKind.Variable,
				data: 16,
				sortText: '16'
			},
			{
				label: '$(^D)',
				insertText: '(^D)',
				kind: CompletionItemKind.Variable,
				data: 17,
				sortText: '17'
			},
			{
				label: '$(^F)',
				insertText: '(^F)',
				kind: CompletionItemKind.Variable,
				data: 18,
				sortText: '18'
			},
			{
				label: '$(+D)',
				insertText: '(+D)',
				kind: CompletionItemKind.Variable,
				data: 19,
				sortText: '19'
			},
			{
				label: '$(+F)',
				insertText: '(+F)',
				kind: CompletionItemKind.Variable,
				data: 20,
				sortText: '20'
			},
			{
				label: '$(?D)',
				insertText: '(?D)',
				kind: CompletionItemKind.Variable,
				data: 21,
				sortText: '21'
			},
			{
				label: '$(?F)',
				insertText: '(?D)',
				kind: CompletionItemKind.Variable,
				data: 22,
				sortText: '22'
			},
			{
				label: 'AR',
				kind: CompletionItemKind.Variable,
				data: 23,
				sortText: '23'
			},
			{
				label: 'AS',
				kind: CompletionItemKind.Variable,
				data: 24,
				sortText: '24'
			},
			{
				label: 'CC',
				kind: CompletionItemKind.Variable,
				data: 25,
				sortText: '25'
			},
			{
				label: 'CXX',
				kind: CompletionItemKind.Variable,
				data: 26,
				sortText: '26'
			},
			{
				label: 'CPP',
				kind: CompletionItemKind.Variable,
				data: 27,
				sortText: '27'
			},
			{
				label: 'FC',
				kind: CompletionItemKind.Variable,
				data: 28,
				sortText: '28'
			},
			{
				label: 'M2C',
				kind: CompletionItemKind.Variable,
				data: 29,
				sortText: '29'
			},
			{
				label: 'PC',
				kind: CompletionItemKind.Variable,
				data: 30,
				sortText: '30',
				
			},
			{
				label: 'CO',
				kind: CompletionItemKind.Variable,
				data: 31,
				sortText: '31'
			},
			{
				label: 'GET',
				kind: CompletionItemKind.Variable,
				data: 32,
				sortText: '32'
			},
			{
				label: 'LEX',
				kind: CompletionItemKind.Variable,
				data: 33,
				sortText: '33'
			},
			{
				label: 'YACC',
				kind: CompletionItemKind.Variable,
				data: 34,
				sortText: '34'
			},
			{
				label: 'LINT',
				kind: CompletionItemKind.Variable,
				data: 35,
				sortText: '35'
			},
			{
				label: 'MAKEINFO',
				kind: CompletionItemKind.Variable,
				data: 36,
				sortText: '36'
			},
			{
				label: 'TEX',
				kind: CompletionItemKind.Variable,
				data: 37,
				sortText: '37'
			},
			{
				label: 'TEXI2DVI',
				kind: CompletionItemKind.Variable,
				data: 38,
				sortText: '38'
			},
			{
				label: 'WEAVE',
				kind: CompletionItemKind.Variable,
				data: 39,
				sortText: '39'
			},
			{
				label: 'CWEAVE',
				kind: CompletionItemKind.Variable,
				data: 40,
				sortText: '40'
			},
			{
				label: 'TANGLE',
				kind: CompletionItemKind.Variable,
				data: 41,
				sortText: '41'
			},
			{
				label: 'CTANGLE',
				kind: CompletionItemKind.Variable,
				data: 42,
				sortText: '42'
			},
			{
				label: 'RM',
				kind: CompletionItemKind.Variable,
				data: 43,
				sortText: '43'
			},
			{
				label: 'ARFLAGS',
				kind: CompletionItemKind.Variable,
				data: 44,
				sortText: '44'
			},
			{
				label: 'ASFLAGS',
				kind: CompletionItemKind.Variable,
				data: 45,
				sortText: '45'
			},
			{
				label: 'CFLAGS',
				kind: CompletionItemKind.Variable,
				data: 46,
				sortText: '46'
			},
			{
				label: 'CXXFLAGS',
				kind: CompletionItemKind.Variable,
				data: 47,
				sortText: '47'
			},
			{
				label: 'COFLAGS',
				kind: CompletionItemKind.Variable,
				data: 48,
				sortText: '48'
			},
			{
				label: 'CPPFLAGS',
				kind: CompletionItemKind.Variable,
				data: 49,
				sortText: '49'
			},
			{
				label: 'FFLAGS',
				kind: CompletionItemKind.Variable,
				data: 50,
				sortText: '50'
			},
			{
				label: 'GFLAGS',
				kind: CompletionItemKind.Variable,
				data: 51,
				sortText: '51'
			},
			{
				label: 'LDFLAGS',
				kind: CompletionItemKind.Variable,
				data: 52,
				sortText: '52'
			},
			{
				label: 'LDLIBS',
				kind: CompletionItemKind.Variable,
				data: 53,
				sortText: '53'
			},
			{
				label: 'LFLAGS',
				kind: CompletionItemKind.Variable,
				data: 54,
				sortText: '54'
			},
			{
				label: 'YFLAGS',
				kind: CompletionItemKind.Variable,
				data: 55,
				sortText: '55'
			},
			{
				label: 'PFLAGS',
				kind: CompletionItemKind.Variable,
				data: 56,
				sortText: '56'
			},
			{
				label: 'RLAGS',
				kind: CompletionItemKind.Variable,
				data: 57,
				sortText: '57'
			},
			{
				label: 'LINTFLAGS',
				kind: CompletionItemKind.Variable,
				data: 58,
				sortText: '58'
			}

		];

		if (_completionInfo.context && _completionInfo.context.triggerCharacter === '$') {
			dict.forEach( function(value) {
				if (!/\\$[.]*/.test(value.label)) {
					value.insertText = '(' + value.label + ')';
				}
			})
		}
		return dict;
	}
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			item.documentation = 'The file name of the target of the rule. \n\nIf the target is an archive member, then ‘$@’ is the name of the archive file. For example, if the target is foo.a(bar.o) then ‘$%’ is bar.o and ‘$@’ is foo.a. ';
		} else if (item.data === 2) {
			item.documentation = 'The target member name, when the target is an archive member. For example, if the target is foo.a(bar.o) then ‘$%’ is bar.o and ‘$@’ is foo.a. ‘$%’ is empty when the target is not an archive member.';
		} else if (item.data === 3) {
			item.documentation = 'The name of the first prerequisite. \n\nIf the target got its recipe from an implicit rule, this will be the first prerequisite added by the implicit rule';
		} else if (item.data === 4) {
			item.documentation = 'The names of all the prerequisites that are newer than the target, with spaces between them. \n\nFor prerequisites which are archive members, only the named member is used';
		} else if (item.data === 5) {
			item.documentation = 'The names of all the prerequisites, with spaces between them. \n\nFor prerequisites which are archive members, only the named member is used. \n\nA target has only one prerequisite on each other file it depends on, no matter how many times each file is listed as a prerequisite. So if you list a prerequisite more than once for a target, the value of $^ contains just one copy of the name. \n\nThis list does not contain any of the order-only prerequisites; for those see the ‘$|’ variable.';
		} else if (item.data === 6) {
			item.documentation = 'The names of all the prerequisites, with spaces between them, but prerequisites listed more than once are duplicated in the order they were listed in the makefile. \n\nThis is primarily useful for use in linking commands where it is meaningful to repeat library file names in a particular order.';
		} else if (item.data === 7) {
			item.documentation = 'The names of all the order-only prerequisites, with spaces between them.';
		} else if (item.data === 8) {
			item.documentation = 'The stem of the target of the rule. Behaves differently depending on the context \n\nIn an implicit rule, if the target is dir/a.foo.b and the target pattern is a.%.b then the stem is dir/foo. The stem is useful for constructing names of related files. \n\nIn a static pattern rule, the stem is part of the file name that matched the ‘%’ in the target pattern. \n\nif the target name ends with a recognized suffix, ‘$*’ is set to the target name minus the suffix. GNU make does this only for compatibility with other implementations of make. You should generally avoid using ‘$*’ in explicit rules.';
		} else if (item.data === 9) {
			item.documentation = 'The directory part of the file name of the target, with the trailing slash removed. \n\nIf the value of ‘$@’ is dir/foo.o then ‘$(@D)’ is dir. \n\nThis value is . if ‘$@’ does not contain a slash.';
		} else if (item.data === 10) {
			item.documentation = 'The file-within-directory part of the file name of the target. \n\nIf the value of ‘$@’ is dir/foo.o then ‘$(@F)’ is foo.o. \n\n‘$(@F)’ is equivalent to ‘$(notdir $@)’.';
		} else if (item.data === 11) {
			item.documentation = 'The directory part of the stem of the target, with the trailing slash removed. \n\nIf the value of ‘$@’ is dir/foo.o then ‘$(*D)’ is dir. \n\nThis value is . if ‘$@’ does not contain a slash.';
		} else if (item.data === 12) {
			item.documentation = 'The file-within-directory part of the stem of the target. If the value of ‘$@’ is dir/foo.o then ‘$(*F)’ is foo.';
		} else if (item.data === 13) {
			item.documentation = 'The directory part of the target archive member name. \n\nThis makes sense only for archive member targets of the form archive(member) and is useful only when member may contain a directory name. ';
		} else if (item.data === 14) {
			item.documentation = 'The file-within-directory part of the target archive member name. \n\nThis makes sense only for archive member targets of the form archive(member) and is useful only when member may contain a directory name. ';
		} else if (item.data === 15) {
			item.documentation = 'The directory part of the first prerequisite.';
		} else if (item.data === 16) {
			item.documentation = 'The file-within-directory part of the first prerequisite.';
		} else if (item.data === 17) {
			item.documentation = 'List of the directory parts of all prerequisites.';
		} else if (item.data === 18) {
			item.documentation = 'List of the file-within-directory parts of all prerequisites.';
		} else if (item.data === 19) {
			item.documentation = 'List of the directory parts of all prerequisites, including multiple instances of duplicated prerequisites.';
		} else if (item.data === 20) {
			item.documentation = 'List of the file-within-directory parts of all prerequisites, including multiple instances of duplicated prerequisites.';
		} else if (item.data === 21) {
			item.documentation = 'List of the directory parts of all prerequisites that are newer than the target.';
		} else if (item.data === 22) {
			item.documentation = 'List of the file-within-directory parts of all prerequisites that are newer than the target.';
		} else if (item.data === 23) {
			item.documentation = 'Archive-maintaining program; default ‘ar’.';
		} else if (item.data === 24) {
			item.documentation = 'Program for compiling assembly files; default ‘as’.';
		} else if (item.data === 25) {
			item.documentation = 'Program for compiling C programs; default ‘cc’.';
		} else if (item.data === 26) {
			item.documentation = 'Program for compiling C++ programs; default ‘g++’.';
		} else if (item.data === 27) {
			item.documentation = 'Program for running the C preprocessor, with results to standard output; default ‘$(CC) -E’.';
		} else if (item.data === 28) {
			item.documentation = 'Program for compiling or preprocessing Fortran and Ratfor programs; default ‘f77’.';
		} else if (item.data === 29) {
			item.documentation = 'Program to use to compile Modula-2 source code; default ‘m2c’.';
		} else if (item.data === 30) {
			item.documentation = 'Program for compiling Pascal programs; default ‘pc’.';
		} else if (item.data === 31) {
			item.documentation = 'Program for extracting a file from RCS; default ‘co’.';
		} else if (item.data === 32) {
			item.documentation = 'Program for extracting a file from SCCS; default ‘get’.';
		} else if (item.data === 33) {
			item.documentation = 'Program to use to turn Lex grammars into source code; default ‘lex’.';
		} else if (item.data === 34) {
			item.documentation = 'Program to use to turn Yacc grammars into source code; default ‘yacc’.';
		} else if (item.data === 35) {
			item.documentation = 'Program to use to run lint on source code; default ‘lint’.';
		} else if (item.data === 36) {
			item.documentation = 'Program to convert a Texinfo source file into an Info file; default ‘makeinfo’.';
		} else if (item.data === 37) {
			item.documentation = 'Program to make TeX DVI files from TeX source; default ‘tex’.';
		} else if (item.data === 38) {
			item.documentation = 'Program to make TeX DVI files from Texinfo source; default ‘texi2dvi’.';
		} else if (item.data === 39) {
			item.documentation = 'Program to translate Web into TeX; default ‘weave’.';
		} else if (item.data === 40) {
			item.documentation = 'Program to translate C Web into TeX; default ‘cweave’.';
		} else if (item.data === 41) {
			item.documentation = 'Program to translate Web into Pascal; default ‘tangle’.';
		} else if (item.data === 42) {
			item.documentation = 'Program to translate C Web into C; default ‘ctangle’.';
		} else if (item.data === 43) {
			item.documentation = 'Command to remove a file; default ‘rm -f’.';
		} else if (item.data === 44) {
			item.documentation = 'Flags to give the archive-maintaining program; default ‘rv’.';
		} else if (item.data === 45) {
			item.documentation = 'Extra flags to give to the assembler (when explicitly invoked on a ‘.s’ or ‘.S’ file).';
		} else if (item.data === 46) {
			item.documentation = 'Extra flags to give to the C compiler.';
		} else if (item.data === 47) {
			item.documentation = 'Extra flags to give to the C++ compiler.';
		} else if (item.data === 48) {
			item.documentation = 'Extra flags to give to the RCS co program.';
		} else if (item.data === 49) {
			item.documentation = 'Extra flags to give to the C preprocessor and programs that use it (the C and Fortran compilers).';
		} else if (item.data === 50) {
			item.documentation = 'Extra flags to give to the Fortran compiler.';
		} else if (item.data === 51) {
			item.documentation = 'Extra flags to give to the SCCS get program.';
		} else if (item.data === 52) {
			item.documentation = 'Extra flags to give to compilers when they are supposed to invoke the linker, ‘ld’, such as -L. Libraries (-lfoo) should be added to the LDLIBS variable instead.';
		} else if (item.data === 53) {
			item.documentation = 'Library flags or names given to compilers when they are supposed to invoke the linker, ‘ld’. LOADLIBES is a deprecated (but still supported) alternative to LDLIBS. Non-library linker flags, such as -L, should go in the LDFLAGS variable.';
		} else if (item.data === 54) {
			item.documentation = 'Extra flags to give to Lex.';
		} else if (item.data === 55) {
			item.documentation = 'Extra flags to give to Yacc.';
		} else if (item.data === 56) {
			item.documentation = 'Extra flags to give to the Pascal compiler.';
		} else if (item.data === 57) {
			item.documentation = 'Extra flags to give to the Fortran compiler for Ratfor programs.';
		} else if (item.data === 58) {
			item.documentation = 'Extra flags to give to lint.';
		}
		return item;
	}
);


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();