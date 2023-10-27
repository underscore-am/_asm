import type { InstructionResult } from "underscore-asm/src/common";
import { CompileButton, RunButton } from "./Icons";
import { type Accessor } from "solid-js";

interface EditorProps {
  ref: HTMLDivElement;
  handleCompile: () => void;
  handleRun: () => void;
  shouldDisable: Accessor<boolean>;
}
export function Editor(props: EditorProps) {
  const { handleRun, handleCompile, ref, shouldDisable } = props;

  return (
    <div class="w-full h-screen overflow-hidden relative flex flex-col">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-[50px]">
        <span class="text-[#3B82F6] text-[32px] font-[700]">Editor</span>
        <div class="flex items-center gap-2">
          <button onClick={handleCompile}>
            <CompileButton />
          </button>
          <button onClick={handleRun} disabled={shouldDisable()} class="disabled:opacity-30">
            <RunButton />
          </button>
        </div>
      </header>
      <div ref={ref} class="flex-1 w-full" />
    </div>
  );
}
