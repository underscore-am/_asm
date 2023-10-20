import { For } from "solid-js";
import { _ASM } from "./Icons";

interface RegisterProps {
  name: string;
  content: number[];
}

const registers: RegisterProps[] = [
  { name: "R0", content: [] },
  { name: "R1", content: [] },
  
];

export function Regs() {
  return (
    <div class="w-[300px] h-full bg-[#131921] p-[30px] flex flex-col gap-2 shrink-0 relative">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-3 absolute top-0 left-0">
        <span class="text-[#A855F7] text-[32px] font-[700]">Regs</span>
        <_ASM />
      </header>
      <div class="flex flex-col pt-[64px] gap-[10px]">
        <For each={registers}>
          {(register) => <Register name={register.name} />}
        </For>
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
