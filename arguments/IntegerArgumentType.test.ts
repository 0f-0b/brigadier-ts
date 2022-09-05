import {
  assertStrictEquals,
  assertThrows,
} from "../deps/std/testing/asserts.ts";

import { assertEquatable } from "../assert_equatable.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import { StringReader } from "../StringReader.ts";
import { integer } from "./IntegerArgumentType.ts";

Deno.test("parse", () => {
  const reader = new StringReader("15");
  assertStrictEquals(integer().parse(reader), 15);
  assertStrictEquals(reader.canRead(), false);
});

Deno.test("parse tooSmall", () => {
  const reader = new StringReader("-5");
  const e = assertThrows(
    () => integer(0, 100).parse(reader),
    CommandSyntaxError,
  );
  assertStrictEquals(e.type, CommandSyntaxError.builtInErrors.integerTooLow);
  assertStrictEquals(e.cursor, 0);
});

Deno.test("parse tooBig", () => {
  const reader = new StringReader("5");
  const e = assertThrows(
    () => integer(-100, 0).parse(reader),
    CommandSyntaxError,
  );
  assertStrictEquals(e.type, CommandSyntaxError.builtInErrors.integerTooHigh);
  assertStrictEquals(e.cursor, 0);
});

Deno.test("equals", () => {
  assertEquatable([
    [integer(), integer()],
    [integer(-100, 100), integer(-100, 100)],
    [integer(-100, 50), integer(-100, 50)],
    [integer(-50, 100), integer(-50, 100)],
  ]);
});

Deno.test("toString", () => {
  assertStrictEquals(integer().toString(), "integer()");
  assertStrictEquals(integer(-100).toString(), "integer(-100)");
  assertStrictEquals(integer(-100, 100).toString(), "integer(-100, 100)");
  assertStrictEquals(
    integer(-Number.MAX_SAFE_INTEGER, 100).toString(),
    "integer(-9007199254740991, 100)",
  );
});
