import { createSignal, onMount } from "solid-js";
import { loadMonaco } from "../utils/editor";
import { type editor as editorNs } from "monaco-editor";
import asm, { type Compiled, type VM } from "underscore-asm";
import { init } from "underscore-asm/src/compile";
import { iserr, isok } from "variants-ts";
import type { InstructionResult } from "underscore-asm/src/common";
import { CompileButton, RunButton } from "./Icons";
import { type Accessor } from "solid-js";

let monacoContainer: HTMLDivElement;

interface EditorProps {
  editor: Accessor<editorNs.IStandaloneCodeEditor | null>;
  setEditor: (value: editorNs.IStandaloneCodeEditor | null) => void;
  vm: Accessor<VM | undefined>;
  setVm: (value: VM) => void;
  refreshAddresses: (vm: VM, result?: InstructionResult) => void;
}
export function Editor(props: EditorProps) {
  const { editor, setEditor, vm, setVm, refreshAddresses } = props;

  const [e, setE] = createSignal<typeof editorNs>();

  onMount(() => {
    loadMonaco(monacoContainer, `move r0 1 \nadd r0 1010`).then((result) => {
      setEditor(result.myEditor);
      result.editor;
      setE(result.editor);
    });
  });

  return (
    <div class="w-full h-screen overflow-hidden relative flex flex-col">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-[50px]">
        <span class="text-[#3B82F6] text-[32px] font-[700]">Editor</span>
        <div class="flex items-center gap-2">
          <button
            onClick={() => {
              const E = editor();
              if (!E) {
                return;
              }
              const value = E.getValue();

              const result = asm.compile(value);
              if (iserr(result)) {
                console.log(result.data);
                const model = E.getModel();

                e()?.setModelMarkers(
                  model!,
                  "myOwner",
                  result.data.map((error) => {
                    return {
                      startLineNumber: error.line + 1, // line number where the error starts
                      endLineNumber: error.line + 1, // line number where the error ends
                      startColumn: 1, // start column of the error
                      endColumn: 1000, // end column of the error
                      message: error.message,
                      severity: 8, // Severity level
                    };
                  })
                );
                return;
              }

              const model = E.getModel();
              e()?.setModelMarkers(model!, "myOwner", []);

              const vm = init(result.data);
              setVm(vm);
              refreshAddresses(vm);
            }}
          >
            <CompileButton />
          </button>
          <button
            onClick={() => {
              const code = vm();
              console.log(code);
              if (!code) {
                return;
              }

              const result = asm.run(code);
              refreshAddresses(code, result);
              console.log(result);
            }}
          >
            <RunButton />
          </button>
        </div>
      </header>
      <div ref={monacoContainer} class="flex-1 w-full" />
    </div>
  );
}
