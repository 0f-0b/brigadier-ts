import { assertStrictEquals } from "@std/assert/strict-equals";

import { StringReader } from "../StringReader.ts";
import { integer } from "../arguments/IntegerArgumentType.ts";
import { argument } from "../builder/RequiredArgumentBuilder.ts";
import { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { assertEquatable } from "../testing/assert_equatable.ts";
import {
  command,
  newContextBuilder,
  testCommandNode,
} from "./CommandNodeTest.ts";

const newNode = () => argument("foo", integer()).build();
testCommandNode(newNode);

Deno.test("parse", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("123 456");
  node.parse(reader, contextBuilder);
  assertStrictEquals(contextBuilder.getArguments().has("foo"), true);
  assertStrictEquals(contextBuilder.getArguments().get("foo")!.result, 123);
});

Deno.test("usage", () => {
  const node = newNode();
  assertStrictEquals(node.getUsageText(), "<foo>");
});

Deno.test("suggestions", async () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const result = await node.listSuggestions(
    contextBuilder.build(""),
    new SuggestionsBuilder("", 0),
  );
  assertStrictEquals(result.isEmpty(), true);
});

Deno.test("equals", () => {
  assertEquatable([
    [
      argument("foo", integer()).build(),
      argument("foo", integer()).build(),
    ],
    [
      argument("foo", integer()).executes(command).build(),
      argument("foo", integer()).executes(command).build(),
    ],
    [
      argument("bar", integer(-100, 100)).build(),
      argument("bar", integer(-100, 100)).build(),
    ],
    [
      argument("foo", integer(-100, 100)).build(),
      argument("foo", integer(-100, 100)).build(),
    ],
    [
      argument("foo", integer()).then(argument("bar", integer())).build(),
      argument("foo", integer()).then(argument("bar", integer())).build(),
    ],
  ]);
});

Deno.test("createBuilder", () => {
  const node = newNode();
  const builder = node.createBuilder();
  assertStrictEquals(builder.getName(), node.getName());
  assertStrictEquals(builder.getType(), node.getType());
  assertStrictEquals(builder.getRequirement(), node.getRequirement());
  assertStrictEquals(builder.getCommand(), node.getCommand());
});
