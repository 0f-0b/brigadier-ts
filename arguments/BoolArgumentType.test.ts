import { assertStrictEquals } from "../deps/std/assert/assert_strict_equals.ts";
import {
  assertSpyCall,
  assertSpyCalls,
  stub,
} from "../deps/std/testing/mock.ts";

import { assertEquatable } from "../assert_equatable.ts";
import { StringReader } from "../StringReader.ts";
import { bool } from "./BoolArgumentType.ts";

Deno.test("parse", () => {
  const reader = new StringReader("");
  const readBoolean = stub(reader, "readBoolean", () => true);
  try {
    assertStrictEquals(bool().parse(reader), true);
    assertSpyCall(readBoolean, 0, { args: [], self: reader });
    assertSpyCalls(readBoolean, 1);
  } finally {
    readBoolean.restore();
  }
});

Deno.test("equals", () => {
  assertEquatable([
    [bool(), bool()],
  ]);
});

Deno.test("toString", () => {
  assertStrictEquals(bool().toString(), "bool()");
});
