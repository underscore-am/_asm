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

export async function loadMonaco(
	container: HTMLDivElement,
	initialCode: string
) {
	const monaco = await import("monaco-editor");

	// Define the new language
	monaco.languages.register({ id: LANGUAGE_ID });

	// Register a tokens provider for the language
	monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
		tokenizer: {
			root: [
				[/!\w+/, "string"],
				[/@\w+/, "type"],
				[/>\w+/, "function"],
				[/<\w+/, "operator"],
				[
					/\b(add|neg|move|jump|jumpeq|jumpne|jumple|jumplt|jumpge|jumpgt|push|pop|call|ret)\b/,
					"keyword",
				],
				[/(\*\b)?(r[0-7]|ip)\b/, "variable"],
				[/[01]+/, "number"],
				[/#[^\n]*/, "comment"],
			],
		},
	});

	// Define the language"s configuration
	monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
		comments: {
			lineComment: "#",
		},
	});

	monaco.editor.defineTheme(THEME_ID, {
		base: "vs-dark",
		colors: {
			"editor.background": "#080808",
		},
		inherit: true,
		rules: [
			{ token: "string", foreground: "ff5454" },
			{ token: "type", foreground: "8cc85f" },
			{ token: "function", foreground: "e3c78a" },
			{ token: "operator", foreground: "80a0ff" },
			{ token: "keyword", foreground: "cf87e8" },
			{ token: "variable", foreground: "ae81ff" },
			{ token: "number", foreground: "36c692" },
			{ token: "comment", foreground: "888888", fontStyle: "italic" },
		],
	});

	monaco.editor.setTheme(THEME_ID);

	const myEditor = monaco.editor.create(container, {
		value: initialCode,
		language: LANGUAGE_ID,
		fontSize: 20,
		minimap: {
			enabled: false,
		},
	});

	return {
		myEditor,
		editor: monaco.editor,
	};
}

export namespace Colors {
	export const BACKGROUND = "080808";
	export const FOREGROUND = "bdbdbd";
	export const BOLD = "eeeeee";
	export const CURSOR = "9e9e9e";
	export const CURSOR_TEXT = "080808";
	export const SELECTION = "b2ceee";
	export const SELECTION_TEXT = "080808";
	export const BLACK_NORMAL = "323437";
	export const RED_NORMAL = "ff5454";
	export const GREEN_NORMAL = "8cc85f";
	export const YELLOW_NORMAL = "e3c78a";
	export const BLUE_NORMAL = "80a0ff";
	export const PURPLE_NORMAL = "cf87e8";
	export const CYAN_NORMAL = "79dac8";
	export const WHITE_NORMAL = "c6c6c6";
	export const BLACK_BRIGHT = "949494";
	export const RED_BRIGHT = "ff5189";
	export const GREEN_BRIGHT = "36c692";
	export const YELLOW_BRIGHT = "c2c292";
	export const BLUE_BRIGHT = "74b2ff";
	export const PURPLE_BRIGHT = "ae81ff";
	export const CYAN_BRIGHT = "85dc85";
	export const WHITE_BRIGHT = "e4e4e4";
};
