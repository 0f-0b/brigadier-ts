import { Equatable } from "../deps/esfx/equatable.ts";
import { assertStrictEquals } from "../deps/std/assert/assert_strict_equals.ts";
import { assertThrows } from "../deps/std/assert/assert_throws.ts";
import { unreachable } from "../deps/std/assert/unreachable.ts";

import { integer } from "../arguments/IntegerArgumentType.ts";
import { assertIterator } from "../assert_iterator.ts";
import { CommandNode } from "../tree/CommandNode.ts";
import { RootCommandNode } from "../tree/RootCommandNode.ts";
import { ArgumentBuilder } from "./ArgumentBuilder.ts";
import { literal } from "./LiteralArgumentBuilder.ts";
import { argument } from "./RequiredArgumentBuilder.ts";

class TestableArgumentBuilder<S> extends ArgumentBuilder<S> {
  override build(): CommandNode<S> {
    unreachable();
  }
}

Deno.test("arguments", () => {
  const builder = new TestableArgumentBuilder();
  const arg = argument("bar", integer());
  builder.then(arg);
  assertIterator(builder.getArguments(), [
    (x) => arg.build()[Equatable.equals](x),
  ]);
});

Deno.test("redirect", () => {
  const builder = new TestableArgumentBuilder();
  const target = new RootCommandNode();
  builder.redirect(target);
  assertStrictEquals(builder.getRedirect(), target);
});

Deno.test("redirect withChild", () => {
  const builder = new TestableArgumentBuilder();
  const target = new RootCommandNode();
  builder.then(literal("foo"));
  assertThrows(() => builder.redirect(target), TypeError);
});

Deno.test("then withRedirect", () => {
  const builder = new TestableArgumentBuilder();
  const target = new RootCommandNode();
  builder.redirect(target);
  assertThrows(() => builder.then(literal("foo")), TypeError);
});
