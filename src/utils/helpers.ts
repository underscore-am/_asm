export type Variant<L, T = unknown> = { type: L; data: T };

export type Ok<T> = Variant<"ok", T>
export type Err<E> = Variant<"err", E>

export type Result<T, E = unknown> = Ok<T> | Err<E>;

type ExhaustiveMatchers<U extends Variant<any, any>, R> = {
	[K in U['type']]: (v: Extract<U, { type: K }>["data"]) => R;
};

type NonExhaustiveMatchers<U extends Variant<any, any>, R> = {
	[K in U['type']]?: (v: Extract<U, { type: K }>["data"]) => R;
} & { _: (v: U) => R };

export function match<Union extends Variant<any, any>, R>(
	handlers: ExhaustiveMatchers<Union, R> | NonExhaustiveMatchers<Union, R>
): (v: Union) => R {
	return (variant) => {
		const handler = handlers[variant.type as keyof typeof handlers];
		return handler(variant);
	};
}

export const variant = <const T extends string, D>(type: T, data: D): Variant<T, D> => ({ type, data } as const);

export const ok = <T>(v: T): Ok<T> => ({ type: "ok", data: v });
export const err = <E>(v: E): Err<E> => ({ type: "err", data: v });

export const isok = <T>(v: Result<T, unknown>): v is Ok<T> => v.type === "ok";
export const iserr = <E>(v: Result<unknown, E>): v is Err<E> => v.type === "err";

