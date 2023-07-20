import { assertStrictEquals } from "./deps/std/assert/assert_strict_equals.ts";
import { assertThrows } from "./deps/std/assert/assert_throws.ts";

import { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import { StringReader } from "./StringReader.ts";

Deno.test("canRead", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.canRead(), true);
  reader.skip();
  assertStrictEquals(reader.canRead(), true);
  reader.skip();
  assertStrictEquals(reader.canRead(), true);
  reader.skip();
  assertStrictEquals(reader.canRead(), false);
});

Deno.test("getRemainingLength", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.getRemainingLength(), 3);
  reader.setCursor(1);
  assertStrictEquals(reader.getRemainingLength(), 2);
  reader.setCursor(2);
  assertStrictEquals(reader.getRemainingLength(), 1);
  reader.setCursor(3);
  assertStrictEquals(reader.getRemainingLength(), 0);
});

Deno.test("canRead length", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.canRead(1), true);
  assertStrictEquals(reader.canRead(2), true);
  assertStrictEquals(reader.canRead(3), true);
  assertStrictEquals(reader.canRead(4), false);
  assertStrictEquals(reader.canRead(5), false);
});

Deno.test("peek", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.peek(), "a");
  assertStrictEquals(reader.getCursor(), 0);
  reader.setCursor(2);
  assertStrictEquals(reader.peek(), "c");
  assertStrictEquals(reader.getCursor(), 2);
});

Deno.test("peek length", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.peek(0), "a");
  assertStrictEquals(reader.peek(2), "c");
  assertStrictEquals(reader.getCursor(), 0);
  reader.setCursor(1);
  assertStrictEquals(reader.peek(1), "c");
  assertStrictEquals(reader.getCursor(), 1);
});

Deno.test("read", () => {
  const reader = new StringReader("abc");
  assertStrictEquals(reader.read(), "a");
  assertStrictEquals(reader.read(), "b");
  assertStrictEquals(reader.read(), "c");
  assertStrictEquals(reader.getCursor(), 3);
});

Deno.test("skip", () => {
  const reader = new StringReader("abc");
  reader.skip();
  assertStrictEquals(reader.getCursor(), 1);
});

Deno.test("getRemaining", () => {
  const reader = new StringReader("Hello!");
  assertStrictEquals(reader.getRemaining(), "Hello!");
  reader.setCursor(3);
  assertStrictEquals(reader.getRemaining(), "lo!");
  reader.setCursor(6);
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("getRead", () => {
  const reader = new StringReader("Hello!");
  assertStrictEquals(reader.getRead(), "");
  reader.setCursor(3);
  assertStrictEquals(reader.getRead(), "Hel");
  reader.setCursor(6);
  assertStrictEquals(reader.getRead(), "Hello!");
});

Deno.test("skipWhitespace none", () => {
  const reader = new StringReader("Hello!");
  reader.skipWhitespace();
  assertStrictEquals(reader.getCursor(), 0);
});

Deno.test("skipWhitespace mixed", () => {
  const reader = new StringReader(" \t \t\nHello!");
  reader.skipWhitespace();
  assertStrictEquals(reader.getCursor(), 5);
});

Deno.test("skipWhitespace empty", () => {
  const reader = new StringReader("");
  reader.skipWhitespace();
  assertStrictEquals(reader.getCursor(), 0);
});

Deno.test("readUnquotedString", () => {
  const reader = new StringReader("hello world");
  assertStrictEquals(reader.readUnquotedString(), "hello");
  assertStrictEquals(reader.getRead(), "hello");
  assertStrictEquals(reader.getRemaining(), " world");
});

Deno.test("readUnquotedString empty", () => {
  const reader = new StringReader("");
  assertStrictEquals(reader.readUnquotedString(), "");
  assertStrictEquals(reader.getRead(), "");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readUnquotedString empty withRemaining", () => {
  const reader = new StringReader(" hello world");
  assertStrictEquals(reader.readUnquotedString(), "");
  assertStrictEquals(reader.getRead(), "");
  assertStrictEquals(reader.getRemaining(), " hello world");
});

Deno.test("readQuotedString", () => {
  const reader = new StringReader('"hello world"');
  assertStrictEquals(reader.readQuotedString(), "hello world");
  assertStrictEquals(reader.getRead(), '"hello world"');
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readSingleQuotedString", () => {
  const reader = new StringReader("'hello world'");
  assertStrictEquals(reader.readQuotedString(), "hello world");
  assertStrictEquals(reader.getRead(), "'hello world'");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readMixedQuotedString doubleInsideSingle", () => {
  const reader = new StringReader("'hello \"world\"'");
  assertStrictEquals(reader.readQuotedString(), 'hello "world"');
  assertStrictEquals(reader.getRead(), "'hello \"world\"'");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readMixedQuotedString singleInsideDouble", () => {
  const reader = new StringReader("\"hello 'world'\"");
  assertStrictEquals(reader.readQuotedString(), "hello 'world'");
  assertStrictEquals(reader.getRead(), "\"hello 'world'\"");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readQuotedString empty", () => {
  const reader = new StringReader("");
  assertStrictEquals(reader.readQuotedString(), "");
  assertStrictEquals(reader.getRead(), "");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readQuotedString emptyQuoted", () => {
  const reader = new StringReader('""');
  assertStrictEquals(reader.readQuotedString(), "");
  assertStrictEquals(reader.getRead(), '""');
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readQuotedString emptyQuoted withRemaining", () => {
  const reader = new StringReader('"" hello world');
  assertStrictEquals(reader.readQuotedString(), "");
  assertStrictEquals(reader.getRead(), '""');
  assertStrictEquals(reader.getRemaining(), " hello world");
});

Deno.test("readQuotedString withEscapedQuote", () => {
  const reader = new StringReader('"hello \\"world\\""');
  assertStrictEquals(reader.readQuotedString(), 'hello "world"');
  assertStrictEquals(reader.getRead(), '"hello \\"world\\""');
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readQuotedString withEscapedEscapes", () => {
  const reader = new StringReader('"\\\\o/"');
  assertStrictEquals(reader.readQuotedString(), "\\o/");
  assertStrictEquals(reader.getRead(), '"\\\\o/"');
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readQuotedString withRemaining", () => {
  const reader = new StringReader('"hello world" foo bar');
  assertStrictEquals(reader.readQuotedString(), "hello world");
  assertStrictEquals(reader.getRead(), '"hello world"');
  assertStrictEquals(reader.getRemaining(), " foo bar");
});

Deno.test("readQuotedString withImmediateRemaining", () => {
  const reader = new StringReader('"hello world"foo bar');
  assertStrictEquals(reader.readQuotedString(), "hello world");
  assertStrictEquals(reader.getRead(), '"hello world"');
  assertStrictEquals(reader.getRemaining(), "foo bar");
});

Deno.test("readQuotedString noOpen", () => {
  const reader = new StringReader('hello world"');
  const e = assertThrows(() => reader.readQuotedString(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedStartOfQuote,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readQuotedString noClose", () => {
  const reader = new StringReader('"hello world');
  const e = assertThrows(() => reader.readQuotedString(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedEndOfQuote,
  );
  assertStrictEquals(e.cursor, 12);
});

Deno.test("readQuotedString invalidEscape", () => {
  const reader = new StringReader('"hello\\nworld"');
  const e = assertThrows(() => reader.readQuotedString(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerInvalidEscape,
  );
  assertStrictEquals(e.cursor, 7);
});

Deno.test("readQuotedString invalidQuoteEscape", () => {
  const reader = new StringReader("'hello\\\"'world");
  const e = assertThrows(() => reader.readQuotedString(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerInvalidEscape,
  );
  assertStrictEquals(e.cursor, 7);
});

Deno.test("readString noQuotes", () => {
  const reader = new StringReader("hello world");
  assertStrictEquals(reader.readString(), "hello");
  assertStrictEquals(reader.getRead(), "hello");
  assertStrictEquals(reader.getRemaining(), " world");
});

Deno.test("readString singleQuotes", () => {
  const reader = new StringReader("'hello world'");
  assertStrictEquals(reader.readString(), "hello world");
  assertStrictEquals(reader.getRead(), "'hello world'");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readString doubleQuotes", () => {
  const reader = new StringReader('"hello world"');
  assertStrictEquals(reader.readString(), "hello world");
  assertStrictEquals(reader.getRead(), '"hello world"');
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readInt", () => {
  const reader = new StringReader("1234567890");
  assertStrictEquals(reader.readInt(), 1234567890);
  assertStrictEquals(reader.getRead(), "1234567890");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readInt negative", () => {
  const reader = new StringReader("-1234567890");
  assertStrictEquals(reader.readInt(), -1234567890);
  assertStrictEquals(reader.getRead(), "-1234567890");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readInt invalid", () => {
  const reader = new StringReader("12.34");
  const e = assertThrows(() => reader.readInt(), CommandSyntaxError);
  assertStrictEquals(e.type, CommandSyntaxError.builtInErrors.readerInvalidInt);
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readInt none", () => {
  const reader = new StringReader("");
  const e = assertThrows(() => reader.readInt(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedInt,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readInt withRemaining", () => {
  const reader = new StringReader("1234567890 foo bar");
  assertStrictEquals(reader.readInt(), 1234567890);
  assertStrictEquals(reader.getRead(), "1234567890");
  assertStrictEquals(reader.getRemaining(), " foo bar");
});

Deno.test("readInt withRemainingImmediate", () => {
  const reader = new StringReader("1234567890foo bar");
  assertStrictEquals(reader.readInt(), 1234567890);
  assertStrictEquals(reader.getRead(), "1234567890");
  assertStrictEquals(reader.getRemaining(), "foo bar");
});

Deno.test("readFloat", () => {
  const reader = new StringReader("123");
  assertStrictEquals(reader.readFloat(), 123);
  assertStrictEquals(reader.getRead(), "123");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readFloat withDecimal", () => {
  const reader = new StringReader("12.34");
  assertStrictEquals(reader.readFloat(), 12.34);
  assertStrictEquals(reader.getRead(), "12.34");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readFloat negative", () => {
  const reader = new StringReader("-123");
  assertStrictEquals(reader.readFloat(), -123);
  assertStrictEquals(reader.getRead(), "-123");
  assertStrictEquals(reader.getRemaining(), "");
});

Deno.test("readFloat invalid", () => {
  const reader = new StringReader("12.34.56");
  const e = assertThrows(() => reader.readFloat(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerInvalidFloat,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readFloat none", () => {
  const reader = new StringReader("");
  const e = assertThrows(() => reader.readFloat(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedFloat,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readFloat withRemaining", () => {
  const reader = new StringReader("12.34 foo bar");
  assertStrictEquals(reader.readFloat(), 12.34);
  assertStrictEquals(reader.getRead(), "12.34");
  assertStrictEquals(reader.getRemaining(), " foo bar");
});

Deno.test("readFloat withRemainingImmediate", () => {
  const reader = new StringReader("12.34foo bar");
  assertStrictEquals(reader.readFloat(), 12.34);
  assertStrictEquals(reader.getRead(), "12.34");
  assertStrictEquals(reader.getRemaining(), "foo bar");
});

Deno.test("expect correct", () => {
  const reader = new StringReader("abc");
  reader.expect("a");
  assertStrictEquals(reader.getCursor(), 1);
});

Deno.test("expect incorrect", () => {
  const reader = new StringReader("bcd");
  const e = assertThrows(() => reader.expect("a"), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedSymbol,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("expect none", () => {
  const reader = new StringReader("");
  const e = assertThrows(() => reader.expect("a"), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedSymbol,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readBoolean correct", () => {
  const reader = new StringReader("true");
  assertStrictEquals(reader.readBoolean(), true);
  assertStrictEquals(reader.getRead(), "true");
});

Deno.test("readBoolean incorrect", () => {
  const reader = new StringReader("tuesday");
  const e = assertThrows(() => reader.readBoolean(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerInvalidBool,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("readBoolean none", () => {
  const reader = new StringReader("");
  const e = assertThrows(() => reader.readBoolean(), CommandSyntaxError);
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedBool,
  );
  assertStrictEquals(e.cursor, 0);
});
