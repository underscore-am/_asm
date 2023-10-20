import { createSignal, onMount } from "solid-js";
import { loadMonaco } from "../utils/editor";
import type { editor } from "monaco-editor";
import asm, { type Compiled, type VM } from "underscore-asm";
import { init } from "underscore-asm/src/compile";
import { iserr, isok } from "variants-ts";
import type { InstructionResult } from "underscore-asm/src/common";
import { CompileButton, RunButton } from "./Icons";

const RAM_SECTION_BLOCKS = Math.pow(2, 8);
let monacoContainer: HTMLDivElement;
export function Editor() {
  const [editor, setEditor] = createSignal<editor.IStandaloneCodeEditor | null>(
    null
  );
  const [compiled, setCompiled] = createSignal<VM>();

  const [ram, setRam] = createSignal<Uint16Array>();
  const [registers, setRegisters] = createSignal<Uint16Array>();
  const [ramPointer, setRamPointer] = createSignal<number>();
  const [instructionResult, setInstructionResult] = createSignal<InstructionResult>();

  function refreshAddresses(vm: VM, result?: InstructionResult) {
  	let address = ramPointer();
  	if (address === undefined) {
		setRamPointer(0);
		address = 0;
	}

	const ramSection = vm.memory.slice(address, address + RAM_SECTION_BLOCKS);
	setRam(ramSection);
	setRegisters(vm.registers);

	if (result) {
		setInstructionResult(result);
	}
  }

  onMount(() => {
    loadMonaco(monacoContainer, `move r0 1 \nadd r0 1010`).then(setEditor);
    setEditor(editor);
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
              setCompiled(vm);
              console.log(vm);
            }}
          >
            <CompileButton />
          </button>
          <button
            onClick={() => {
              const code = compiled();
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
