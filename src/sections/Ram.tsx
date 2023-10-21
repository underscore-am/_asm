import { Minus, Plus } from "lucide-solid";
import { type Accessor, Index } from "solid-js";
import type { InstructionResult } from "underscore-asm";
import { RAM_SECTION_BLOCKS } from "./Page";

interface RamProps {
  section: Accessor<number[] | undefined>;
  pointer: Accessor<number | undefined>;
  result: Accessor<InstructionResult | undefined>;
  setRamPointer: (changer: (old: number) => number) => void;
}

export function Ram(props: RamProps) {
  const { section, pointer, result, setRamPointer } = props;

  console.log(section);
  const decimal = () => decimalToBinary(pointer() ?? 0, 8);

  return (
    <div class="w-full bg-[#131921] relative">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-3">
        <span class="text-[#10B981] text-[32px] font-[700]">Ram</span>
      </header>

      <div class="w-full flex gap-[12px] items-center justify-center px-[18px] top-[94px] absolute">
        <button
          class="w-[64px] h-[46px] bg-[#fff] rounded-[8px] flex items-center justify-center"
          onClick={() =>
            setRamPointer((old) => {
              old--;
              if (old < 0) {
                old = RAM_SECTION_BLOCKS - 1;
              }
              return old;
            })
          }
        >
          <Minus />
        </button>
        <div class="flex-1 bg-[#fff] w-full h-[46px] rounded-[8px] flex items-center justify-center font-mono">
          <span class="text-[#131921] text-[24px] font-[900]">{decimal()}</span>
        </div>
        <button
          class="w-[64px] h-[46px] bg-[#fff] rounded-[8px] flex items-center justify-center"
          onClick={() =>
            setRamPointer((old) => {
              old++;
              if (old >= RAM_SECTION_BLOCKS) {
                old = 0;
              }
              return old;
            })
          }
        >
          <Plus />
        </button>
      </div>

      <div class="w-full h-[94px]" />

      <div class="flex flex-col gap-3 px-[18px] pb-[200px] overflow-hidden overflow-y-scroll h-full">
        <Index each={section()}>
          {(value, index) => {
            const modifiedAddress = () => {
              const register = result()?.registerDereferencedModified;
              if (register === undefined) {
                return -1;
              }
            };
            return (
              <div class="w-full h-[40px] flex gap-2 font-mono">
                <div class="bg-[#2B313A] rounded-[6px] flex items-center justify-between px-[18px]">
                  <span class="text-[#fff] text-[24px] font-[500]">
                    {decimalToBinary(index, 8)}
                  </span>
                </div>
                <div class="bg-[#BDD6E8] rounded-[6px] flex items-center justify-center px-[18px] flex-1">
                  <span
                    class="text-[#000] text-[24px] font-[500]"
                    classList={{
                      "!bg-[red]": modifiedAddress() === index,
                    }}
                  >
                    {decimalToBinary(value(), 16)}
                  </span>
                </div>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}

export function decimalToBinary(decimal: number, bits: number): string {
  return (decimal >>> 0).toString(2).padStart(bits, "0");
}
