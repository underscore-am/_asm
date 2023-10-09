import { onMount } from "solid-js";
import { loadMonaco } from "../utils/editor";
import { compileCode } from "../utils/compiler";
import { compile } from "../utils/compiler-v2";


let monacoContainer: HTMLDivElement;
export function Editor() {
	onMount(() => {
		loadMonaco(monacoContainer, "");
		console.log(compile(`
		move r1 r2
		`));
	});

	return <div ref={monacoContainer} class="h-[800px]">
	</div>
}
