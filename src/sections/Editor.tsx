import { createSignal, onMount } from "solid-js";
import { loadMonaco } from "../utils/editor";
import type { editor } from "monaco-editor";
import asm, { type Compiled, type VM } from "underscore-asm";
import { init } from "underscore-asm/src/compile";
import { iserr, isok } from "variants-ts";
import type { InstructionResult } from "underscore-asm/src/common";
import { CompileButton, RunButton } from "./Icons";
import { type Accessor } from "solid-js";

let monacoContainer: HTMLDivElement;

interface EditorProps {
  editor: Accessor<editor.IStandaloneCodeEditor | null>;
  setEditor: (value: editor.IStandaloneCodeEditor | null) => void;
  vm: Accessor<VM | undefined>;
  setVm: (value: VM) => void;
}

export function Editor(props: EditorProps) {
  const { editor, setEditor, vm, setVm } = props;

  onMount(() => {
    loadMonaco(monacoContainer, `move r0 1 \nadd r0 1010`).then(setEditor);
  });

  return (
    <div class="w-full h-screen overflow-hidden relative flex flex-col">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-[50px]">
        <span class="text-[#3B82F6] text-[32px] font-[700]">Editor</span>
        <div class="flex items-center gap-2">
          <button
            onClick={() => {
              const value = editor()?.getValue();
              if (!value) {
                return;
              }
              const result = asm.compile(value);
              if (iserr(result)) {
                console.log(result.data);
                return;
              }

              const vm = init(result.data);
              setVm(vm);
              console.log(vm);
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
              console.log(result);
            }}
          >
            <RunButton />
          </button>
        </div>
      </header>
      <div ref={monacoContainer} class="flex-1 w-full overflow-hidden" />
    </div>
  );
}
