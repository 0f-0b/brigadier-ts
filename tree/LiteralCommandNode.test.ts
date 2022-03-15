import { tupleEqualer } from "../deps/@esfx/equatable.ts";
import {
  assert,
  assertIsError,
  assertStrictEquals,
  assertThrows,
} from "../deps/std/testing/asserts.ts";
import { assertEquatable } from "../test_util.ts";
import { StringReader } from "../StringReader.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { StringRange } from "../context/StringRange.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import { Suggestion } from "../suggestion/Suggestion.ts";
import { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import {
  command,
  newContextBuilder,
  testCommandNode,
} from "./CommandNodeTest.ts";

const newNode = () => literal("foo").build();
testCommandNode(newNode);

Deno.test("parse", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("foo bar");
  node.parse(reader, contextBuilder);
  assertStrictEquals(reader.getRemaining(), " bar");
});

Deno.test("parseExact", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("foo");
  node.parse(reader, contextBuilder);
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("parseSimilar", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("foobar");
  assertThrows(() => node.parse(reader, contextBuilder), (e: Error) => {
    assertIsError(e, CommandSyntaxError);
    assertStrictEquals(
      e.type,
      CommandSyntaxError.builtInErrors.literalIncorrect,
    );
    assertStrictEquals(e.cursor, 0);
  });
});

Deno.test("parseInvalid", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("bar");
  assertThrows(() => node.parse(reader, contextBuilder), (e: Error) => {
    assertIsError(e, CommandSyntaxError);
    assertStrictEquals(
      e.type,
      CommandSyntaxError.builtInErrors.literalIncorrect,
    );
    assertStrictEquals(e.cursor, 0);
  });
});

Deno.test("usage", () => {
  const node = newNode();
  assertStrictEquals(node.getUsageText(), "foo");
});

Deno.test("suggestions", async () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const empty = await node.listSuggestions(
    contextBuilder.build(""),
    new SuggestionsBuilder("", 0),
  );
  assert(tupleEqualer.equals([
    new Suggestion(StringRange.at(0), "foo"),
  ], empty.list));
  const foo = await node.listSuggestions(
    contextBuilder.build("foo"),
    new SuggestionsBuilder("foo", 0),
  );
  assertStrictEquals(foo.isEmpty(), true);
  const food = await node.listSuggestions(
    contextBuilder.build("food"),
    new SuggestionsBuilder("food", 0),
  );
  assertStrictEquals(food.isEmpty(), true);
  const b = await node.listSuggestions(
    contextBuilder.build("b"),
    new SuggestionsBuilder("b", 0),
  );
  assertStrictEquals(b.isEmpty(), true);
});

Deno.test("equals", () => {
  assertEquatable([
    [
      literal("foo").build(),
      literal("foo").build(),
    ],
    [
      literal("bar").executes(command).build(),
      literal("bar").executes(command).build(),
    ],
    [
      literal("bar").build(),
      literal("bar").build(),
    ],
    [
      literal("foo").then(literal("bar")).build(),
      literal("foo").then(literal("bar")).build(),
    ],
  ]);
});

Deno.test("createBuilder", () => {
  const node = newNode();
  const builder = node.createBuilder();
  assertStrictEquals(builder.getLiteral(), node.getLiteral());
  assertStrictEquals(builder.getRequirement(), node.getRequirement());
  assertStrictEquals(builder.getCommand(), node.getCommand());
});
