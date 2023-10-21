import { type Accessor, Index } from "solid-js";
import { _ASM } from "./Icons";
import { decimalToBinary } from "./Ram";
import type { InstructionResult } from "underscore-asm";

interface RegisterProps {
  registers: Accessor<number[] | undefined>;
  result: Accessor<InstructionResult | undefined>;
}

export function Regs(props: RegisterProps) {
  const { registers, result } = props;

  return (
    <div class="w-[400px] h-full bg-[#131921] p-[30px] flex flex-col gap-2 shrink-0 relative">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-3 absolute top-0 left-0">
        <span class="text-[#A855F7] text-[32px] font-[700]">Regs</span>
        <_ASM />
      </header>
      <div class="flex flex-col pt-[64px] gap-[10px] font-mono">
        <Index each={registers()}>
          {(register, index) => {
            const binary = () => decimalToBinary(register(), 16);

            return (
              <div
                class="bg-[#fff] rounded-[6px] h-[40px] flex items-center justify-between px-[18px]"
                classList={{
                  "!bg-[green]": result()?.registerRead === index,
                  "!bg-[red]": result()?.registerModified === index,
                }}
              >
                <span class="text-[#131921] text-[20px] font-[900]">
                  R{index} {binary()}
                </span>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}

function Register({ name }: { name: string }) {
  return (
    <div class="bg-[#fff] rounded-[6px] h-[40px] flex items-center justify-between px-[18px]">
      <span class="text-[#131921] text-[20px] font-[900]">{name}</span>
    </div>
  );
}
