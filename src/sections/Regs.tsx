import { For } from "solid-js";

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
    <div class="w-[300px] h-full bg-[#131921] p-[30px] flex flex-col gap-2 shrink-0">
      <For each={registers}>
        {(register) => <Register name={register.name} />}
      </For>
    </div>
  );
}

function Register({ name }: { name: string }) {
  return <div class="bg-[#fff] rounded-[6px]">{name}</div>;
}
