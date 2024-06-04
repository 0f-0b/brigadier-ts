import { assert } from "@std/assert/assert";

declare global {
  interface IteratorConstructor {
    new <T>(): IterableIterator<T>;
    from<T>(
      iteratorLike: ((object | string) & Iterable<T>) | (object & Iterator<T>),
    ): IterableIterator<T>;
    // deno-lint-ignore no-explicit-any
    readonly prototype: IterableIterator<any>;
  }

  // deno-lint-ignore no-var
  var Iterator: IteratorConstructor;
}

export function assertIterator<T>(
  o: Iterable<T> | Iterator<T>,
  fns: readonly ((value: T) => unknown)[],
): undefined {
  const it = Iterator.from(o);
  for (const fn of fns) {
    const { value, done } = it.next();
    assert(!done, "Iterator yielded too few values");
    fn(value);
  }
  const { done } = it.next();
  assert(done, "Iterator yielded too many values");
}
