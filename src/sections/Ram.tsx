import { Minus, Plus } from "lucide-solid";
import { For, type Accessor, Index } from "solid-js";
import { compile } from "underscore-asm/src/compile";

interface RamProps {
  section: Accessor<number[] | undefined>;
  pointer: Accessor<number | undefined>;
}

export function Ram(props: RamProps) {
  const { section } = props;

  console.log(section);

  return (
    <div class="w-full bg-[#131921] relative">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-3">
        <span class="text-[#10B981] text-[32px] font-[700]">Ram</span>
      </header>

      <div class="w-full flex gap-[12px] items-center justify-center px-[18px] top-[94px] absolute">
        <button class="w-[64px] h-[46px] bg-[#fff] rounded-[8px] flex items-center justify-center">
          <Minus />
        </button>
        <div class="flex-1 bg-[#fff] w-full h-[46px] rounded-[8px]"></div>
        <button class="w-[64px] h-[46px] bg-[#fff] rounded-[8px] flex items-center justify-center">
          <Plus />
        </button>
      </div>

      <div class="w-full h-[94px]" />

      <div class="flex flex-col gap-3 px-[18px] pb-[94px] overflow-hidden overflow-y-scroll h-full">
        <Index each={section()}>
          {(value, index) => (
            <div class="w-full h-[40px] flex gap-2 font-mono">
              <div class="bg-[#2B313A] rounded-[6px] flex items-center justify-between px-[18px]">
                <span class="text-[#fff] text-[24px] font-[500]">
                  {decimalToBinary(index, 8)}
                </span>
              </div>
              <div class="bg-[#BDD6E8] rounded-[6px] flex items-center justify-center px-[18px] flex-1">
                <span class="text-[#000] text-[24px] font-[500]">
                  {decimalToBinary(value(), 16)}
                </span>
              </div>
            </div>
          )}
        </Index>
      </div>
    </div>
  );
}

function decimalToBinary(decimal: number, bits: number): string {
  return (decimal >>> 0).toString(2).padStart(bits, "0");
}
