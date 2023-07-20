import { assertStrictEquals } from "../deps/std/assert/assert_strict_equals.ts";

import { integer } from "../arguments/IntegerArgumentType.ts";
import { assertIterator } from "../assert_iterator.ts";
import { argument } from "./RequiredArgumentBuilder.ts";

const type = integer();
const command = () => 0;

Deno.test("build", () => {
  const node = argument("foo", type).build();
  assertStrictEquals(node.getName(), "foo");
  assertStrictEquals(node.getType(), type);
});

Deno.test("buildWithExecutor", () => {
  const node = argument("foo", type).executes(command).build();
  assertStrictEquals(node.getName(), "foo");
  assertStrictEquals(node.getType(), type);
  assertStrictEquals(node.getCommand(), command);
});

Deno.test("buildWithChildren", () => {
  const node = argument("foo", type)
    .then(argument("bar", integer()))
    .then(argument("baz", integer()))
    .build();
  assertIterator(node.getChildren(), [Object, Object]);
});
