import { assertStrictEquals } from "../deps/std/testing/asserts.ts";

import { assertEquatable } from "../assert_equatable.ts";
import { StringReader } from "../StringReader.ts";
import { ParsedArgument } from "./ParsedArgument.ts";

Deno.test("equals", () => {
  assertEquatable([
    [new ParsedArgument(0, 3, "bar"), new ParsedArgument(0, 3, "bar")],
    [new ParsedArgument(3, 6, "baz"), new ParsedArgument(3, 6, "baz")],
    [new ParsedArgument(6, 9, "baz"), new ParsedArgument(6, 9, "baz")],
  ]);
});

Deno.test("getRaw", () => {
  const reader = new StringReader("0123456789");
  const argument = new ParsedArgument(2, 5, "");
  assertStrictEquals(argument.range.get(reader), "234");
});
