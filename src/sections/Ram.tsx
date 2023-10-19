import { compile } from "underscore-asm/src/compile";

export function Ram() {
  return <div class="w-full"><button
  onClick={() => compile(window.editor)}></button></div>;
}
