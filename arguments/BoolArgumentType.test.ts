import { assertStrictEquals } from "@std/assert/assert_strict_equals";
import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";

import { assertEquatable } from "../assert_equatable.ts";
import { StringReader } from "../StringReader.ts";
import { bool } from "./BoolArgumentType.ts";

Deno.test("parse", () => {
  const reader = new StringReader("");
  using readBoolean = stub(reader, "readBoolean", () => true);
  assertStrictEquals(bool().parse(reader), true);
  assertSpyCall(readBoolean, 0, { args: [], self: reader });
  assertSpyCalls(readBoolean, 1);
});

Deno.test("equals", () => {
  assertEquatable([
    [bool(), bool()],
  ]);
});

Deno.test("toString", () => {
  assertStrictEquals(bool().toString(), "bool()");
});
