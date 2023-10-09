import { ok, isok, err, iserr, match, variant } from "./helpers";
import type { Ok, Err, Result, Variant } from "./helpers";

type CompileError = {
	line: number
	message: string
}

type Memory = Uint16Array

export function compileCode(code: string): Result<Memory, CompileError[]> {
	const tokens = code
		.split("\n")
		.map(x => x.trim())
		.map(tokenizeLine)

	console.log({ tokens })

	const { labels, data } = tokens
		.reduce(extractLabels, {
			labels: {},
			data: 0,
		})

	console.log({ labels, data })

	const { memory, errors } = tokens
		.reduce(parseTokens, {
			labels,
			errors: [],
			memory: new Uint16Array(data),
			instruction: 0,
		})

	console.log({ memory, errors })

	if (errors.length > 0) {
		return err(errors)
	}

	return ok(memory)
}

const actions = [
	"halt",
	"move",
	"add",
	"mul",
	"div",
	"mod",
	"neg",
	"not",
	"and",
	"or",
	"xor",
	"cmp",
	"jumplt",
	"jumple",
	"jumpeq",
	"jumpne",
	"jumpgt",
	"jumpge",
] as const

const payloadCount = [
	["halt"],
	["neg", "not", "jumpge", "jumpgt", "jumpne", "jumpeq", "jumple", "jumplt"],
	["move", "add", "mul", "div", "mod", "and", "or", "xor", "cmp"],
] as const

const actionSet = new Set(actions)

type Address = number
type Register = number
type Label = string
type Literal = number
type Action = (typeof actions)[number]

type Token =
	| Variant<"label", Label>
	| Variant<"register", Register>
	| Variant<"dereferenced", Register>
	| Variant<"literal", Literal>
	| Variant<"action", Action>
	| Variant<"definition", Label>

const instructionToPayload = {
	halt: 0b0000_0000_0000_0000,
	move_reg_reg: 0b0000_0000_0000_0001,
	move_reg_dreg: 0b0000_0000_0000_0010,
	move_dreg_reg: 0b0000_0000_0000_0011,
	move_dreg_dreg: 0b0000_0000_0000_0100,
	move_reg_lit: 0b0000_0000_0000_0101,
	move_dreg_lit: 0b0000_0000_0000_0110,
	add: 0b0000_0000_0000_0111,
	mul: 0b0000_0000_0000_1000,
	div: 0b0000_0000_0000_1001,
	mod: 0b0000_0000_0000_1010,
	neg: 0b0000_0000_0000_1011,
	not: 0b0000_0000_0000_1100,
	and: 0b0000_0000_0000_1101,
	or: 0b0000_0000_0000_1110,
	xor: 0b0000_0000_0000_1111,

	cmp_reg_reg: 0b0000_0000_0001_0000,
	cmp_reg_lit: 0b0000_0000_0001_0001,
	cmp_lit_reg: 0b0000_0000_0001_0010,

	jumplt: 0b0000_0000_0001_0011,
	jumple: 0b0000_0000_0001_0100,
	jumpeq: 0b0000_0000_0001_0101,
	jumpne: 0b0000_0000_0001_0110,
	jumpgt: 0b0000_0000_0001_0111,
	jumpge: 0b0000_0000_0001_1000,
};

const instructionToBinary = {
	halt: [
		{
			arguments: [],
			compile: "halt",
		} as const,
	],
	move: [
		{
			arguments: ["register", "register"],
			compile: "move_reg_reg",
		} as const,
		{
			arguments: ["register", "dereferenced"],
			compile: "move_reg_dreg",
		} as const,
		{
			arguments: ["dereferenced", "register"],
			compile: "move_dreg_reg",
		} as const,
		{
			arguments: ["dereferenced", "dereferenced"],
			compile: "move_dreg_dreg",
		} as const,
		{
			arguments: ["register", "literal"],
			compile: "move_reg_lit",
		} as const,
		{
			arguments: ["dereferenced", "literal"],
			compile: "move_dreg_lit",
		} as const,
	],
	add: [
		{
			arguments: ["register", "register"],
			compile: "add",
		} as const,
	],
	mul: [
		{
			arguments: ["register", "register"],
			compile: "mul",
		} as const,
	],
	div: [
		{
			arguments: ["register", "register"],
			compile: "div",
		} as const,
	],
	mod: [
		{
			arguments: ["register", "register"],
			compile: "mod",
		} as const,
	],
	neg: [
		{
			arguments: ["register"],
			compile: "neg",
		} as const,
	],
	not: [
		{
			arguments: ["register"],
			compile: "not",
		} as const,
	],
	and: [
		{
			arguments: ["register", "register"],
			compile: "and",
		} as const,
	],
	or: [
		{
			arguments: ["register", "register"],
			compile: "or",
		} as const,
	],
	xor: [
		{
			arguments: ["register", "register"],
			compile: "xor",
		} as const,
	],
	cmp: [
		{
			arguments: ["register", "register"],
			compile: "cmp_reg_reg",
		} as const,
		{
			arguments: ["register", "literal"],
			compile: "cmp_reg_lit",
		} as const,
		{
			arguments: ["literal", "register"],
			compile: "cmp_lit_reg",
		} as const,
	],
	jumplt: [
		{
			arguments: ["label"],
			compile: "jumplt",
		} as const,
	],
	jumple: [
		{
			arguments: ["label"],
			compile: "jumple",
		} as const,
	],
	jumpeq: [
		{
			arguments: ["label"],
			compile: "jumpeq",
		} as const,
	],
	jumpne: [
		{
			arguments: ["label"],
			compile: "jumpne",
		} as const,
	],
	jumpgt: [
		{
			arguments: ["label"],
			compile: "jumpgt",
		} as const,
	],
	jumpge: [

		{
			arguments: ["label"],
			compile: "jumpge",
		} as const,
	],
}


type Instruction<L> =
	| Variant<"halt">

	// R1 R2
	| Variant<"move_reg_reg", [Register, Register]>
	// R1 *R2
	| Variant<"move_reg_dreg", [Register, Register]>
	// *R1 R2
	| Variant<"move_dreg_reg", [Register, Register]>
	// *R1 *R2
	| Variant<"move_dreg_dreg", [Register, Register]>
	// R1 101
	| Variant<"move_reg_lit", [Register, Literal]>
	// *R1 101
	| Variant<"move_dreg_lit", [Register, Literal]>

	| Variant<"add", [Register, Register]>
	| Variant<"mul", [Register, Register]>
	| Variant<"div", [Register, Register]>
	| Variant<"mod", [Register, Register]>
	| Variant<"neg", [Register]>
	| Variant<"not", [Register]>
	| Variant<"and", [Register, Register]>
	| Variant<"or", [Register, Register]>
	| Variant<"xor", [Register, Register]>

	| Variant<"cmp_reg_reg", [Register, Register]>
	| Variant<"cmp_reg_lit", [Register, Register]>
	| Variant<"cmp_lit_reg", [Register, Register]>

	| Variant<"jumplt", [L]>
	| Variant<"jumple", [L]>
	| Variant<"jumpeq", [L]>
	| Variant<"jumpne", [L]>
	| Variant<"jumpgt", [L]>
	| Variant<"jumpge", [L]>

const registerAddress: Record<string, number | undefined> = {
	R0: 0b0000_0000_0000_1000,
	R1: 0b0000_0000_0000_1001,
	R2: 0b0000_0000_0000_1010,
	R3: 0b0000_0000_0000_1011,
	R4: 0b0000_0000_0000_1100,
	R5: 0b0000_0000_0000_1101,
	R6: 0b0000_0000_0000_1110,
	R7: 0b0000_0000_0000_1111,
}

function fromBinary(binary: string): number {
	return parseInt(binary, 2)
}

function isWordAction(word: string): word is Action {
	return actionSet.has(word);
}

function tokenizeLine(content: string, line: number): Result<Token, CompileError>[] {
	const isEmpty = content.trim().length === 0
	if (isEmpty) {
		return []
	}

	const isComment = content.trim().startsWith("#")
	if (isComment) {
		return []
	}

	return content.split(" ").map((word): Result<Token, CompileError> => {
		const isAction = isWordAction(word)
		if (isAction) {
			return ok(variant("action", word))
		}

		const isRegister = word.startsWith("R")
		if (isRegister) {
			const address = registerAddress[word]

			if (!address) {
				return err({ line, message: "Expected a register from R0 to R7" })
			}

			return ok({ type: "register", data: address })
		}

		const isDereferencedRegister = word.startsWith("*R")
		if (isDereferencedRegister) {
			const address = registerAddress[word.slice(1)]

			if (!address) {
				return err({ line, message: "Expected a dereferenced register from R0 to R7" })
			}

			return ok(variant("dereferenced", address))
		}

		const isDefinition = word.startsWith("@")
		if (isDefinition) {
			return ok(variant("definition", word.slice(1)))
		}

		const isLiteral = word.startsWith("0") || word.startsWith("1")
		if (isLiteral) {
			if (word.length > 16) {
				return err({ line, message: `Expected a 16-bit binary number, got ${word.length} bits` })
			}

			const value = fromBinary(word)

			if (isNaN(value)) {
				return err({ line, message: "Expected a binary number" })
			}

			return ok({ type: "literal", data: value })
		}

		return ok(variant("label", word))
	})
}

interface ParseState {
	labels: Record<Label, Address | undefined>
	errors: CompileError[]
	memory: Memory
	instruction: number
}

function parseTokens(acc: ParseState, line: Result<Token, CompileError>[], lineNum: number): ParseState {
	if (line.length === 0) {
		return acc
	}

	const errors = []
	const tokens: Token[] = []

	for (const token of line) {
		if (iserr(token)) {
			errors.push(token.data)
		} else {
			tokens.push(token.data)
		}
	}

	if (errors.length > 0) {
		return {
			...acc,
			errors: [...acc.errors, ...errors],
		}
	}

	const [first, ...rest] = tokens

	if (first.type === "definition" || first.type === "label") {
		return acc
	}

	if (first.type !== "action") {
		return {
			...acc,
			errors: [...acc.errors, { line: lineNum, message: "Expected an action" }],
		}
	}

	const { data: name } = first

	const binary = instructionToBinary[name].map(x => x).find((instruction) => {
		const { arguments: args } = instruction
		if (args.length !== rest.length) {
			return false;
		}

		const unmatched = rest.find((restArg, i) => restArg.type !== args[i])

		if (unmatched) {
			return false
		}

		return true
	})

	if (!binary) {
		return {
			...acc,
			errors: [...acc.errors, { line: lineNum, message: "Invalid arguments" }],
		}
	}

	const { compile } = binary
	const payload = rest.map((arg) => {
		const isNumber = typeof arg.data === "number"
		if (isNumber) {
			return arg.data
		}

		const { data: label } = arg

		const address = acc.labels[label]
		if (!address) {
			throw new Error("Label not found")
		}

		return address
	})


	const instructionCount = payload.length
	if (rest.length !== instructionCount) {
		return {
			...acc,
			errors: [...acc.errors, { line: lineNum, message: "Invalid arguments" }],
		}
	}

	const instructionBinary = instructionToPayload[compile]

	if (!instructionBinary) {
		return {
			...acc,
			errors: [...acc.errors, { line: lineNum, message: "Invalid instruction" }],
		}
	}

	acc.memory[acc.instruction++] = instructionBinary
	for (const singlePayload of payload) {
		acc.memory[acc.instruction++] = singlePayload
	}

	return acc;
}

interface ExtractState {
	labels: Record<Label, Address | undefined>
	data: number
}

function extractLabels(acc: ExtractState, line: Result<Token, CompileError>[]): ExtractState {
	if (line.length === 0) {
		return acc
	}

	const [first] = line
	if (iserr(first)) {
		return acc
	}

	const { data: token } = first

	if (token.type === "action") {
		const payloadSize = payloadCount.findIndex((payload) => payload.includes(token.data))

		if (payloadSize === -1) {
			return acc
		}

		return {
			...acc,
			data: acc.data + payloadSize + 1,
		}
	}

	if (token.type !== "definition") {
		return acc
	}

	const { data: name } = token

	if (acc.labels[name]) {
		return acc
	}

	return {
		...acc,
		labels: {
			...acc.labels,
			[name]: acc.data,
		},
	}
}

