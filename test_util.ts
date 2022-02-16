import { Equatable } from "./deps.ts";
import { assert } from "./test_deps.ts";

function isIterable(x: unknown): x is Iterable<unknown> {
  return (typeof x === "object" || typeof x === "function") && x !== null &&
    typeof (x as never)[Symbol.iterator] === "function";
}

export function assertIterator<T>(
  it: Iterable<T> | Iterator<T>,
  fns: readonly ((elem: T) => void)[],
): void {
  if (isIterable(it)) {
    it = it[Symbol.iterator]();
  }
  for (const fn of fns) {
    const { value, done } = it.next();
    assert(!done, "Iterator yielded too few values");
    fn(value);
  }
  assert(it.next().done, "Iterator yielded too many values");
}

const singleton = Object.freeze({});

export function assertEquatable<T extends Equatable>(
  groups: readonly (readonly T[])[],
): void {
  for (const as of groups) {
    for (const a of as) {
      assert(!a[Equatable.equals](undefined), "Value equals to undefined");
      assert(!a[Equatable.equals](null), "Value equals to null");
      assert(
        !a[Equatable.equals](singleton),
        "Value equals to an arbitrary object",
      );
      for (const bs of groups) {
        if (as === bs) {
          for (const b of bs) {
            assert(
              a[Equatable.equals](b),
              "Values in the same group do not equal",
            );
          }
        } else {
          for (const b of bs) {
            assert(!a[Equatable.equals](b), "Values in different groups equal");
          }
        }
      }
    }
  }
}
