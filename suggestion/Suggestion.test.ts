import { Equatable } from "../deps/esfx/equatable.ts";
import { assert } from "../deps/std/assert/assert.ts";
import { assertStrictEquals } from "../deps/std/assert/assert_strict_equals.ts";

import { StringRange } from "../context/StringRange.ts";
import { Suggestion } from "./Suggestion.ts";

Deno.test("apply insertation start", () => {
  const suggestion = new Suggestion(StringRange.at(0), "And so I said: ");
  assertStrictEquals(
    suggestion.apply("Hello world!"),
    "And so I said: Hello world!",
  );
});

Deno.test("apply insertation middle", () => {
  const suggestion = new Suggestion(StringRange.at(6), "small ");
  assertStrictEquals(suggestion.apply("Hello world!"), "Hello small world!");
});

Deno.test("apply insertation end", () => {
  const suggestion = new Suggestion(StringRange.at(5), " world!");
  assertStrictEquals(suggestion.apply("Hello"), "Hello world!");
});

Deno.test("apply replacement start", () => {
  const suggestion = new Suggestion(StringRange.between(0, 5), "Goodbye");
  assertStrictEquals(suggestion.apply("Hello world!"), "Goodbye world!");
});

Deno.test("apply replacement middle", () => {
  const suggestion = new Suggestion(StringRange.between(6, 11), "Alex");
  assertStrictEquals(suggestion.apply("Hello world!"), "Hello Alex!");
});

Deno.test("apply replacement end", () => {
  const suggestion = new Suggestion(StringRange.between(6, 12), "Creeper!");
  assertStrictEquals(suggestion.apply("Hello world!"), "Hello Creeper!");
});

Deno.test("apply replacement everything", () => {
  const suggestion = new Suggestion(StringRange.between(0, 12), "Oh dear.");
  assertStrictEquals(suggestion.apply("Hello world!"), "Oh dear.");
});

Deno.test("expand unchanged", () => {
  const suggestion = new Suggestion(StringRange.at(1), "oo");
  assertStrictEquals(suggestion.expand("f", StringRange.at(1)), suggestion);
});

Deno.test("expand left", () => {
  const suggestion = new Suggestion(StringRange.at(1), "oo");
  const actual = suggestion.expand("f", StringRange.between(0, 1));
  const expected = new Suggestion(StringRange.between(0, 1), "foo");
  assert(expected[Equatable.equals](actual));
});

Deno.test("expand right", () => {
  const suggestion = new Suggestion(StringRange.at(0), "minecraft:");
  const actual = suggestion.expand("fish", StringRange.between(0, 4));
  const expected = new Suggestion(StringRange.between(0, 4), "minecraft:fish");
  assert(expected[Equatable.equals](actual));
});

Deno.test("expand both", () => {
  const suggestion = new Suggestion(StringRange.at(11), "minecraft:");
  const actual = suggestion.expand(
    "give Steve fish block",
    StringRange.between(5, 21),
  );
  const expected = new Suggestion(
    StringRange.between(5, 21),
    "Steve minecraft:fish block",
  );
  assert(expected[Equatable.equals](actual));
});

Deno.test("expand replacement", () => {
  const suggestion = new Suggestion(StringRange.between(6, 11), "strangers");
  const actual = suggestion.expand("Hello world!", StringRange.between(0, 12));
  const expected = new Suggestion(
    StringRange.between(0, 12),
    "Hello strangers!",
  );
  assert(expected[Equatable.equals](actual));
});
