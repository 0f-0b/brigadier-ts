import { Equatable } from "../deps/@esfx/equatable.ts";
import {
  assertStrictEquals,
  assertThrows,
} from "../deps/std/testing/asserts.ts";
import { assertEquatable } from "../test_util.ts";
import { CommandDispatcher } from "../CommandDispatcher.ts";
import { RootCommandNode } from "../tree/RootCommandNode.ts";
import { CommandContextBuilder } from "./CommandContextBuilder.ts";
import { ParsedArgument } from "./ParsedArgument.ts";
import { StringRange } from "./StringRange.ts";

export class TestableCommandNode<S> extends RootCommandNode<S> {
  override [Equatable.equals](other: unknown): boolean {
    return this === other;
  }
}

const source = {};
const dispatcher = new CommandDispatcher();
const rootNode = new TestableCommandNode();
const newBuilder = () =>
  new CommandContextBuilder(dispatcher, source, rootNode, 0);

Deno.test("getArgument nonexistent", () => {
  const ctx = newBuilder().build("");
  assertThrows(() => ctx.getArgument<number>("foo"), TypeError);
});

Deno.test("getArgument", () => {
  const ctx = newBuilder()
    .withArgument("foo", new ParsedArgument(0, 1, 123))
    .build("123");
  assertStrictEquals(ctx.getArgument<number>("foo"), 123);
});

Deno.test("source", () => {
  const ctx = newBuilder().build("");
  assertStrictEquals(ctx.getSource(), source);
});

Deno.test("rootNode", () => {
  const ctx = newBuilder().build("");
  assertStrictEquals(ctx.getRootNode(), rootNode);
});

Deno.test("equals", () => {
  const otherSource = {};
  const command = () => 0;
  const otherCommand = () => 0;
  const otherRootNode = new TestableCommandNode();
  const node = new TestableCommandNode();
  const otherNode = new TestableCommandNode();
  assertEquatable([
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0).build(""),
      new CommandContextBuilder(dispatcher, source, rootNode, 0).build(""),
    ],
    [
      new CommandContextBuilder(dispatcher, source, otherRootNode, 0).build(""),
      new CommandContextBuilder(dispatcher, source, otherRootNode, 0).build(""),
    ],
    [
      new CommandContextBuilder(dispatcher, otherSource, rootNode, 0).build(""),
      new CommandContextBuilder(dispatcher, otherSource, rootNode, 0).build(""),
    ],
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withCommand(command)
        .build(""),
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withCommand(command)
        .build(""),
    ],
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withCommand(otherCommand)
        .build(""),
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withCommand(otherCommand)
        .build(""),
    ],
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withArgument("foo", new ParsedArgument(0, 1, 123))
        .build("123"),
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withArgument("foo", new ParsedArgument(0, 1, 123))
        .build("123"),
    ],
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withNode(node, StringRange.between(0, 3))
        .withNode(otherNode, StringRange.between(4, 6))
        .build("123 456"),
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withNode(node, StringRange.between(0, 3))
        .withNode(otherNode, StringRange.between(4, 6))
        .build("123 456"),
    ],
    [
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withNode(otherNode, StringRange.between(0, 3))
        .withNode(node, StringRange.between(4, 6))
        .build("123 456"),
      new CommandContextBuilder(dispatcher, source, rootNode, 0)
        .withNode(otherNode, StringRange.between(0, 3))
        .withNode(node, StringRange.between(4, 6))
        .build("123 456"),
    ],
  ]);
});
