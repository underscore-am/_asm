import { createEffect, createSignal } from "solid-js";
import { Editor } from "./Editor";
import { Ram } from "./Ram";
import { Regs } from "./Regs";
import type { editor } from "monaco-editor";
import type { VM } from "underscore-asm";
import type { InstructionResult } from "underscore-asm/src/common";

export const RAM_SECTION_BLOCKS = Math.pow(2, 8);

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
    <div class="flex h-[100vh] w-full overflow-hidden gap-[6px] bg-black">
      <Editor
        vm={vm}
        setVm={setVm}
        editor={editor}
        setEditor={setEditor}
        refreshAddresses={refreshAddresses}
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
