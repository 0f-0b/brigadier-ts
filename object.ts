export function isObject(o: unknown): o is object {
  return o !== null && (typeof o === "object" || typeof o === "function");
}

export function isIterable(o: unknown): o is object & Iterable<unknown> {
  return isObject(o) &&
    typeof (o as Iterable<unknown>)[Symbol.iterator] === "function";
}

export function toIterator<T>(o: Iterable<T> | Iterator<T>): Iterator<T> {
  return isIterable(o) ? o[Symbol.iterator]() : o;
}
