import { assertStrictEquals, assertThrows } from "../test_deps.ts";
import { assertEquatable } from "../test_util.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { StringReader } from "../StringReader.ts";
import { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import {
  genericCommandNodeTest,
  newContextBuilder,
} from "./CommandNodeTest.ts";
import { RootCommandNode } from "./RootCommandNode.ts";

const newNode = () => new RootCommandNode();
genericCommandNodeTest(newNode);

Deno.test("parse", () => {
  const node = newNode();
  const contextBuilder = newContextBuilder();
  const reader = new StringReader("hello world");
  node.parse(reader, contextBuilder);
  assertStrictEquals(reader.getCursor(), 0);
});

Deno.test("addChildNoRoot", () => {
  const node = newNode();
  const child = new RootCommandNode();
  assertThrows(() => node.addChild(child), TypeError);
});

Deno.test("usage", () => {
  const node = newNode();
  assertStrictEquals(node.getUsageText(), "");
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
      new RootCommandNode(),
      new RootCommandNode(),
    ],
    [
      (() => {
        const node = new RootCommandNode();
        node.addChild(literal("foo").build());
        return node;
      })(),
      (() => {
        const node = new RootCommandNode();
        node.addChild(literal("foo").build());
        return node;
      })(),
    ],
  ]);
});
