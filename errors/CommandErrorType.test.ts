import { assertStrictEquals } from "@std/assert/strict-equals";

import { LiteralMessage } from "../LiteralMessage.ts";
import { StringReader } from "../StringReader.ts";
import { CommandErrorType } from "./CommandErrorType.ts";
import { CommandSyntaxError } from "./CommandSyntaxError.ts";

const type = new CommandErrorType(() => new LiteralMessage("error"));

Deno.test("createWithContext simple", () => {
  const reader = new StringReader("Foo bar");
  reader.setCursor(5);
  const error = type.createWithContext(reader);
  assertStrictEquals(error.type, type);
  assertStrictEquals(error.input, "Foo bar");
  assertStrictEquals(error.cursor, 5);
});

Deno.test("createWithContext dynamic", () => {
  const type = new CommandErrorType((name: string) =>
    new LiteralMessage(`Hello, ${name}!`)
  );
  const reader = new StringReader("Foo bar");
  reader.setCursor(5);
  const error = type.createWithContext(reader, "World");
  assertStrictEquals(error.type, type);
  assertStrictEquals(error.input, "Foo bar");
  assertStrictEquals(error.cursor, 5);
});

Deno.test("getContext none", () => {
  const error = new CommandSyntaxError(type, new LiteralMessage("error"));
  assertStrictEquals(error.getContext(), undefined);
});

Deno.test("getContext short", () => {
  const error = new CommandSyntaxError(
    type,
    new LiteralMessage("error"),
    "Hello world!",
    5,
  );
  assertStrictEquals(error.getContext(), "Hello<--[HERE]");
});

Deno.test("getContext long", () => {
  const error = new CommandSyntaxError(
    type,
    new LiteralMessage("error"),
    "Hello world! This has an error in it. Oh dear!",
    20,
  );
  assertStrictEquals(error.getContext(), "...d! This ha<--[HERE]");
});
