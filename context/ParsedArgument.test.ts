import { assertStrictEquals } from "@std/assert/strict-equals";

import { StringReader } from "../StringReader.ts";
import { assertEquatable } from "../testing/assert_equatable.ts";
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
