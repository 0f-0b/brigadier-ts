import { assertStrictEquals } from "@std/assert/assert-strict-equals";

import { integer } from "../arguments/IntegerArgumentType.ts";
import { assertIterator } from "../assert_iterator.ts";
import { literal } from "./LiteralArgumentBuilder.ts";
import { argument } from "./RequiredArgumentBuilder.ts";

const command = () => 0;

Deno.test("build", () => {
  const node = literal("foo").build();
  assertStrictEquals(node.getLiteral(), "foo");
});

Deno.test("buildWithExecutor", () => {
  const node = literal("foo").executes(command).build();
  assertStrictEquals(node.getLiteral(), "foo");
  assertStrictEquals(node.getCommand(), command);
});

Deno.test("buildWithChildren", () => {
  const node = literal("foo")
    .then(argument("bar", integer()))
    .then(argument("baz", integer()))
    .build();
  assertIterator(node.getChildren(), [Object, Object]);
});
