import { assertStrictEquals } from "@std/assert/assert-strict-equals";
import { assertThrows } from "@std/assert/assert-throws";

import { assertEquatable } from "../assert_equatable.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import { StringReader } from "../StringReader.ts";
import { float } from "./FloatArgumentType.ts";

Deno.test("parse", () => {
  const reader = new StringReader("15");
  assertStrictEquals(float().parse(reader), 15);
  assertStrictEquals(reader.canRead(), false);
});

Deno.test("parse tooSmall", () => {
  const reader = new StringReader("-5");
  const e = assertThrows(
    () => float(0, 100).parse(reader),
    CommandSyntaxError,
  );
  assertStrictEquals(e.type, CommandSyntaxError.builtInErrors.floatTooLow);
  assertStrictEquals(e.cursor, 0);
});

Deno.test("parse tooBig", () => {
  const reader = new StringReader("5");
  const e = assertThrows(
    () => float(-100, 0).parse(reader),
    CommandSyntaxError,
  );
  assertStrictEquals(e.type, CommandSyntaxError.builtInErrors.floatTooHigh);
  assertStrictEquals(e.cursor, 0);
});

Deno.test("equals", () => {
  assertEquatable([
    [float(), float()],
    [float(-100, 100), float(-100, 100)],
    [float(-100, 50), float(-100, 50)],
    [float(-50, 100), float(-50, 100)],
  ]);
});

Deno.test("toString", () => {
  assertStrictEquals(float().toString(), "float()");
  assertStrictEquals(float(-100).toString(), "float(-100)");
  assertStrictEquals(float(-100, 100).toString(), "float(-100, 100)");
  assertStrictEquals(
    float(-Number.MAX_VALUE, 100).toString(),
    "float(-1.7976931348623157e+308, 100)",
  );
});
