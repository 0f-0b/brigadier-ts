import { assert } from "./deps/std/testing/asserts.ts";

import { isIterable } from "./common.ts";

export function assertIterator<T>(
  it: Iterable<T> | Iterator<T>,
  fns: readonly ((elem: T) => unknown)[],
): undefined {
  if (isIterable(it)) {
    it = it[Symbol.iterator]();
  }
  for (const fn of fns) {
    const { value, done } = it.next();
    assert(!done, "Iterator yielded too few values");
    fn(value);
  }
  const { done } = it.next();
  assert(done, "Iterator yielded too many values");
  return;
}
