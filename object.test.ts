import { assert } from "./deps/std/assert/assert.ts";
import { assertEquals } from "./deps/std/assert/assert_equals.ts";

import { isIterable, isObject, toIterator } from "./object.ts";

Deno.test("isObject", { permissions: "none" }, () => {
  assert(isObject({}));
  assert(isObject(Object));
  assert(isObject(Object(42)));
  assert(!isObject(42));
  assert(!isObject(null));
  assert(!isObject(undefined));
});

Deno.test("isIterable", { permissions: "none" }, () => {
  assert(isIterable([1, 2]));
  assert(isIterable(Object("foo")));
  assert(isIterable({ [Symbol.iterator]() {} }));
  assert(!isIterable("foo"));
  assert(!isIterable(function* () {}));
  assert(!isIterable({ [Symbol.asyncIterator]() {} }));
});

Deno.test("toIterator", { permissions: "none" }, () => {
  assertEquals(toIterator([1, 2]).next(), { value: 1, done: false });
  assertEquals(toIterator(Object("foo")).next(), { value: "f", done: false });
  assertEquals(
    toIterator({ next: () => ({ value: 2, done: true }) }).next(),
    { value: 2, done: true },
  );
});
