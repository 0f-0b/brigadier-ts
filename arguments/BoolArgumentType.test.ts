import { assertStrictEquals } from "@std/assert/assert-strict-equals";
import { assertSpyCall, assertSpyCalls, stub } from "@std/testing/mock";

import { StringReader } from "../StringReader.ts";
import { assertEquatable } from "../testing/assert_equatable.ts";
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
