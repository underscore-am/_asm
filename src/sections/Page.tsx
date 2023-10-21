import { createEffect, createSignal, onMount } from "solid-js";
import { Editor } from "./Editor";
import { Ram } from "./Ram";
import { Regs } from "./Regs";
import type { editor } from "monaco-editor";
import { compile, run } from "underscore-asm";
import type { InstructionResult, VM } from "underscore-asm";
import { init } from "underscore-asm";
import { iserr } from "variants-ts";
import { loadMonaco } from "../utils/editor";
import { type editor as editorNs } from "monaco-editor";

export const RAM_SECTION_BLOCKS = Math.pow(2, 8);
let monacoContainer: HTMLDivElement;

export function Page() {
  const [editor, setEditor] = createSignal<editor.IStandaloneCodeEditor | null>(
    null
  );
  const [vm, setVm] = createSignal<VM>();
  const [ram, setRam] = createSignal<number[]>();
  const [registers, setRegisters] = createSignal<number[]>();
  const [ramPointer, setRamPointer] = createSignal<number>();
  const [instructionResult, setInstructionResult] =
    createSignal<InstructionResult>();

  function refreshAddresses(vm: VM, result?: InstructionResult) {
    let address = ramPointer();
    if (address === undefined) {
      setRamPointer(0);
      address = 0;
    }

    const ramSection = vm.memory.slice(address, address + RAM_SECTION_BLOCKS);
    setRam(Array.from(ramSection));
    setRegisters(Array.from(vm.registers));
    setInstructionResult(result);
  }

  const [e, setE] = createSignal<typeof editorNs>();

  onMount(() => {
    loadMonaco(monacoContainer, `move r0 1 \nadd r0 1010`).then((result) => {
      setEditor(result.myEditor);
      result.editor;
      setE(result.editor);
    });
  });

  function handleRun() {
    const code = vm();
    console.log(code);
    if (!code) {
      return;
    }

    const result = run(code);
    refreshAddresses(code, result);
    console.log(result);
  }

  function handleCompile() {
    const E = editor();
    if (!E) {
      return;
    }
    const value = E.getValue();

    const result = compile(value);
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
  }

  createEffect(() => {
    let address = ramPointer();
    if (address === undefined) {
      return;
    }
    const start = address * RAM_SECTION_BLOCKS;
    const ramSection = vm()?.memory.slice(start, start + RAM_SECTION_BLOCKS);

    if (!ramSection) {
      return;
    }

    setRam(Array.from(ramSection));
  });

  return (
    <div
      class="flex h-[100vh] w-full overflow-hidden gap-[6px] bg-black"
      onKeyDown={(e) => {
        if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          handleCompile();
          console.log("adad");
        }
      }}
    >
      <Editor
        handleRun={handleRun}
        handleCompile={handleCompile}
        ref={monacoContainer}
      />
      <Ram
        section={ram}
        pointer={ramPointer}
        result={instructionResult}
        setRamPointer={setRamPointer}
      />
      <Regs registers={registers} result={instructionResult} />
    </div>
  );
}
