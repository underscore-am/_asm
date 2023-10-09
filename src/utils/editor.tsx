// let monaco: typeof import("monaco-editor");

// import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";

// import "monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget.js";
// import "monaco-editor/esm/vs/editor/browser/widget/diffEditorWidget.js";
// import "monaco-editor/esm/vs/editor/browser/widget/diffNavigator.js";
// import "monaco-editor/esm/vs/editor/contrib/anchorSelect/anchorSelect.js";
// import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
// import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
// import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js";
// import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
// import "monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions.js";
// import "monaco-editor/esm/vs/editor/contrib/codelens/codelensController.js";
// import "monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js";
// import "monaco-editor/esm/vs/editor/contrib/comment/comment.js";
// import "monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu.js";
// import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
// import "monaco-editor/esm/vs/editor/contrib/dnd/dnd.js";
// import "monaco-editor/esm/vs/editor/contrib/documentSymbols/documentSymbols.js";

// import "monaco-editor/esm/vs/editor/contrib/find/browser/findController.js";

// import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";
// import "monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom.js";
// import "monaco-editor/esm/vs/editor/contrib/format/formatActions.js";
// import "monaco-editor/esm/vs/editor/contrib/gotoError/gotoError.js";
// import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands.js";
// import "monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition.js";
// import "monaco-editor/esm/vs/editor/contrib/hover/hover.js";
// import "monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace.js";
// import "monaco-editor/esm/vs/editor/contrib/indentation/indentation.js";
// import "monaco-editor/esm/vs/editor/contrib/inlineHints/inlineHintsController.js";
// import "monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
// import "monaco-editor/esm/vs/editor/contrib/linkedEditing/linkedEditing.js";
// import "monaco-editor/esm/vs/editor/contrib/links/links.js";
// import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";
// import "monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints.js";
// import "monaco-editor/esm/vs/editor/contrib/rename/rename.js";
// import "monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect.js";
// import "monaco-editor/esm/vs/editor/contrib/snippet/snippetController2.js";
// import "monaco-editor/esm/vs/editor/contrib/suggest/suggestController.js";
// import "monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode.js";
// import "monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/unusualLineTerminators.js";
// import "monaco-editor/esm/vs/editor/contrib/viewportSemanticTokens/viewportSemanticTokens.js";
// import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter.js";
// import "monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations.js";
// import "monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js";
// import "monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js";
// END_FEATURES

// import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";


const LANGUAGE_ID = "pseudo-assembly";
const THEME_ID = "pseudo-assembly-theme";

export async function loadMonaco(container: HTMLDivElement, initialCode: string) {
	const monaco = await import("monaco-editor");

	// Define the new language
	monaco.languages.register({ id: LANGUAGE_ID });

	// Register a tokens provider for the language
	monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
		tokenizer: {
			root: [
				[/\b(add|neg|move|jump|less|lesseq|equal|ret)\b/, "keyword"],  // example instructions
				[/\b(R[0-9]+)\b/, "identifier"],  // example for registers like R1, R2, etc.
				[/[0-9]+/, "number"],  // numbers
				[/;.*$/, "comment"],  // comments starting with ;
			]
		}
	});

	// Define the language"s configuration
	monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
		comments: {
			lineComment: ";"
		}
	});

	// Create the editor instance
	const myEditor = monaco.editor.create(container, {
		value: initialCode,
		language: LANGUAGE_ID,
	});

	monaco.editor.defineTheme(THEME_ID, {
		base: "vs-dark",
		colors: {},
		inherit: true,
		rules: [
			// { token: "keyword", foreground: "0000FF" },
			// { token: "identifier", foreground: "FF0000" },
			// { token: "number", foreground: "00FF00" },
			// { token: "comment", foreground: "888888", fontStyle: "italic" }
		]
	});

	monaco.editor.setTheme(THEME_ID);
}

