import { onMount } from "solid-js";
import { loadMonaco } from "../utils/editor";
import { compileCode } from "../utils/compiler";


let monacoContainer: HTMLDivElement;
export function Editor() {
	onMount(() => {
		loadMonaco(monacoContainer, "");
		console.log(compileCode(`
		move R1 R2
		@start
		add R1 R2
		jumpeq start
		`));
	});

	return <div ref={monacoContainer} class="h-[800px]">
	</div>
}
