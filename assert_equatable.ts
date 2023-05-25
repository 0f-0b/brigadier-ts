import { Equatable } from "./deps/esfx/equatable.ts";
import { assert } from "./deps/std/testing/asserts.ts";

// deno-lint-ignore ban-types
const singleton = Object.freeze({ __proto__: null } as object);

export function assertEquatable<T extends Equatable>(
  groups: readonly (readonly T[])[],
): undefined {
  for (const as of groups) {
    for (const a of as) {
      assert(!a[Equatable.equals](undefined), "Value equals undefined");
      assert(!a[Equatable.equals](null), "Value equals null");
      assert(
        !a[Equatable.equals](singleton),
        "Value equals an arbitrary object",
      );
      for (const bs of groups) {
        if (as === bs) {
          for (const b of bs) {
            assert(
              a[Equatable.equals](b),
              "Values in the same group do not equal",
            );
            assert(
              a[Equatable.hash]() === b[Equatable.hash](),
              "Hashes of values in the same group do not equal",
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
  return;
}
