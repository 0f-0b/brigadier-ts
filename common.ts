// deno-lint-ignore-file ban-types
export function isObject(x: unknown): x is object {
  return x !== null && (typeof x === "object" || typeof x === "function");
}

export function isIterable(x: unknown): x is object & Iterable<unknown> {
  return isObject(x) && typeof (x as never)[Symbol.iterator] === "function";
}
