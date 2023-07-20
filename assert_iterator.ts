import { assert } from "./deps/std/assert/assert.ts";

import { toIterator } from "./object.ts";

export function assertIterator<T>(
  o: Iterable<T> | Iterator<T>,
  fns: readonly ((value: T) => unknown)[],
): undefined {
  const it = toIterator(o);
  for (const fn of fns) {
    const { value, done } = it.next();
    assert(!done, "Iterator yielded too few values");
    fn(value);
  }
  const { done } = it.next();
  assert(done, "Iterator yielded too many values");
}
