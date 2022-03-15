import { Equatable, tupleEqualer } from "../deps/@esfx/equatable.ts";
import { assert, assertStrictEquals } from "../deps/std/testing/asserts.ts";
import { StringRange } from "../context/StringRange.ts";
import { Suggestion } from "./Suggestion.ts";
import { Suggestions } from "./Suggestions.ts";

Deno.test("merge empty", () => {
  const merged = Suggestions.merge("foo b", []);
  assertStrictEquals(merged.isEmpty(), true);
});

Deno.test("merge single", () => {
  const suggestions = new Suggestions(StringRange.at(5), [
    new Suggestion(StringRange.at(5), "ar"),
  ]);
  const merged = Suggestions.merge("foo b", [suggestions]);
  assert(suggestions[Equatable.equals](merged));
});

Deno.test("merge multiple", () => {
  const a = new Suggestions(StringRange.at(5), [
    new Suggestion(StringRange.at(5), "ar"),
    new Suggestion(StringRange.at(5), "az"),
    new Suggestion(StringRange.at(5), "Az"),
  ]);
  const b = new Suggestions(StringRange.between(4, 5), [
    new Suggestion(StringRange.between(4, 5), "foo"),
    new Suggestion(StringRange.between(4, 5), "qux"),
    new Suggestion(StringRange.between(4, 5), "apple"),
    new Suggestion(StringRange.between(4, 5), "Bar"),
  ]);
  const merged = Suggestions.merge("foo b", [a, b]);
  assert(tupleEqualer.equals([
    new Suggestion(StringRange.between(4, 5), "apple"),
    new Suggestion(StringRange.between(4, 5), "bar"),
    new Suggestion(StringRange.between(4, 5), "Bar"),
    new Suggestion(StringRange.between(4, 5), "baz"),
    new Suggestion(StringRange.between(4, 5), "bAz"),
    new Suggestion(StringRange.between(4, 5), "foo"),
    new Suggestion(StringRange.between(4, 5), "qux"),
  ], merged.list));
});
