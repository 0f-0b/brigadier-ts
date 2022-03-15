import { assertSpyCall, assertSpyCalls } from "../deps/mock/asserts.ts";
import { stub } from "../deps/mock/stub.ts";
import { assertStrictEquals } from "../deps/std/testing/asserts.ts";
import { assertEquatable } from "../test_util.ts";
import { StringReader } from "../StringReader.ts";
import {
  escapeIfRequired,
  greedyString,
  string,
  word,
} from "./StringArgumentType.ts";

Deno.test("parseWord", () => {
  const reader = new StringReader("");
  const readUnquotedString = stub(reader, "readUnquotedString", () => "hello");
  try {
    assertStrictEquals(word().parse(reader), "hello");
    assertSpyCall(readUnquotedString, 0, { args: [], self: reader });
    assertSpyCalls(readUnquotedString, 1);
  } finally {
    readUnquotedString.restore();
  }
});

Deno.test("parseString", () => {
  const reader = new StringReader("");
  const readString = stub(reader, "readString", () => "hello world");
  try {
    assertStrictEquals(string().parse(reader), "hello world");
    assertSpyCall(readString, 0, { args: [], self: reader });
    assertSpyCalls(readString, 1);
  } finally {
    readString.restore();
  }
});

Deno.test("parseGreedyString", () => {
  const reader = new StringReader("Hello world! This is a test.");
  assertStrictEquals(
    greedyString().parse(reader),
    "Hello world! This is a test.",
  );
  assertStrictEquals(reader.canRead(), false);
});

Deno.test("equals", () => {
  assertEquatable([
    [word(), word()],
    [string(), string()],
    [greedyString(), greedyString()],
  ]);
});

Deno.test("toString", () => {
  assertStrictEquals(word().toString(), "word()");
  assertStrictEquals(string().toString(), "string()");
  assertStrictEquals(greedyString().toString(), "greedyString()");
});

Deno.test("escapeIfRequired notRequired", () => {
  assertStrictEquals(escapeIfRequired("hello"), "hello");
  assertStrictEquals(escapeIfRequired(""), "");
});

Deno.test("escapeIfRequired multipleWords", () => {
  assertStrictEquals(escapeIfRequired("hello world"), '"hello world"');
});

Deno.test("escapeIfRequired quote", () => {
  assertStrictEquals(
    escapeIfRequired('hello "world"!'),
    '"hello \\"world\\"!"',
  );
});

Deno.test("escapeIfRequired escapes", () => {
  assertStrictEquals(escapeIfRequired("\\"), '"\\\\"');
});

Deno.test("escapeIfRequired singleQuote", () => {
  assertStrictEquals(escapeIfRequired('"'), '"\\""');
});
