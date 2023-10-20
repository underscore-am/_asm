import { For, type Accessor } from "solid-js";
import { compile } from "underscore-asm/src/compile";

interface RamProps {
  section: Accessor<number[] | undefined>;
}

export function Ram(props: RamProps) {
  const { section } = props;

  return (
    <div class="w-full bg-[#131921]">
      <header class="bg-[#121212] w-full h-[64px] flex items-center justify-between px-3">
        <span class="text-[#10B981] text-[32px] font-[700]">Ram</span>
      </header>
      <div>
        <For each={section()}>{(value) => <div>{value}</div>}</For>
      </div>
    </div>
  );
}
