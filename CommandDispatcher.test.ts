import { Equatable, tupleEqualer } from "@esfx/equatable";
import { ref } from "@esfx/ref";
import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import { assertExists } from "@std/assert/exists";
import { assertRejects } from "@std/assert/rejects";
import { assertStrictEquals } from "@std/assert/strict-equals";
import { assertSpyCalls, spy } from "@std/testing/mock";

import type { Command } from "./Command.ts";
import { CommandDispatcher } from "./CommandDispatcher.ts";
import type { ResultConsumer } from "./ResultConsumer.ts";
import { StringReader } from "./StringReader.ts";
import { integer } from "./arguments/IntegerArgumentType.ts";
import { word } from "./arguments/StringArgumentType.ts";
import { literal } from "./builder/LiteralArgumentBuilder.ts";
import { argument } from "./builder/RequiredArgumentBuilder.ts";
import type { CommandContext } from "./context/CommandContext.ts";
import { StringRange } from "./context/StringRange.ts";
import { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import { Suggestion } from "./suggestion/Suggestion.ts";
import type { Suggestions } from "./suggestion/Suggestions.ts";
import type { CommandNode } from "./tree/CommandNode.ts";

const source = {};

function offset(input: string, offset: number): StringReader {
  const result = new StringReader(input);
  result.setCursor(offset);
  return result;
}

Deno.test("createAndExecuteCommand", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  subject.register(literal("foo").executes(command));
  assertStrictEquals(await subject.execute("foo", source), 42);
  assertSpyCalls(command, 1);
});

Deno.test("createAndExecuteOffsetCommand", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  subject.register(literal("foo").executes(command));
  assertStrictEquals(await subject.execute(offset("/foo", 1), source), 42);
  assertSpyCalls(command, 1);
});

Deno.test("createAndMergeCommands", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  subject.register(literal("base").then(literal("foo").executes(command)));
  subject.register(literal("base").then(literal("bar").executes(command)));
  assertStrictEquals(await subject.execute("base foo", source), 42);
  assertStrictEquals(await subject.execute("base bar", source), 42);
  assertSpyCalls(command, 2);
});

Deno.test("executeUnknownCommand", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("bar"));
  subject.register(literal("baz"));
  const e = await assertRejects(
    () => subject.execute("foo", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("executeImpermissibleCommand", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo").requires(() => false));
  const e = await assertRejects(
    () => subject.execute("foo", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("executeEmptyCommand", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal(""));
  const e = await assertRejects(
    () => subject.execute("", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("executeUnknownSubcommand", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo").executes(() => 0));
  const e = await assertRejects(
    () => subject.execute("foo bar", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownArgument,
  );
  assertStrictEquals(e.cursor, 4);
});

Deno.test("executeIncorrectLiteral", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo").executes(() => 0).then(literal("bar")));
  const e = await assertRejects(
    () => subject.execute("foo baz", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownArgument,
  );
  assertStrictEquals(e.cursor, 4);
});

Deno.test("executeAmbiguousIncorrectArgument", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo").executes(() => 0).then(literal("bar")).then(literal("baz")),
  );
  const e = await assertRejects(
    () => subject.execute("foo unknown", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownArgument,
  );
  assertStrictEquals(e.cursor, 4);
});

Deno.test("executeSubcommand", async () => {
  const subCommand = spy(() => 100);
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo")
      .then(literal("a"))
      .then(literal("=").executes(subCommand))
      .then(literal("c"))
      .executes(() => 0),
  );
  assertStrictEquals(await subject.execute("foo =", source), 100);
  assertSpyCalls(subCommand, 1);
});

Deno.test("parseIncompleteLiteral", () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo").then(literal("bar").executes(() => 0)));
  const parse = subject.parse("foo ", source);
  assertStrictEquals(parse.reader.getRemaining(), " ");
  assertStrictEquals(parse.context.getNodes().length, 1);
});

Deno.test("parseIncompleteArgument", () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo").then(argument("bar", integer()).executes(() => 0)),
  );
  const parse = subject.parse("foo ", source);
  assertStrictEquals(parse.reader.getRemaining(), " ");
  assertStrictEquals(parse.context.getNodes().length, 1);
});

Deno.test("executeAmbiguiousParentSubcommand", async () => {
  const command = spy(() => 42);
  const subCommand = spy(() => 100);
  const subject = new CommandDispatcher();
  subject.register(
    literal("test")
      .then(argument("incorrect", integer()).executes(command))
      .then(
        argument("right", integer())
          .then(argument("sub", integer()).executes(subCommand)),
      ),
  );
  assertStrictEquals(await subject.execute("test 1 2", source), 100);
  assertSpyCalls(subCommand, 1);
  assertSpyCalls(command, 0);
});

Deno.test("executeAmbiguiousParentSubcommandViaRedirect", async () => {
  const command = spy(() => 42);
  const subCommand = spy(() => 100);
  const subject = new CommandDispatcher();
  const real = subject.register(
    literal("test")
      .then(argument("incorrect", integer()).executes(command))
      .then(
        argument("right", integer())
          .then(argument("sub", integer()).executes(subCommand)),
      ),
  );
  subject.register(literal("redirect").redirect(real));
  assertStrictEquals(await subject.execute("redirect 1 2", source), 100);
  assertSpyCalls(subCommand, 1);
  assertSpyCalls(command, 0);
});

Deno.test("executeRedirectedMultipleTimes", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  const concreteNode = subject.register(literal("actual").executes(command));
  const redirectNode = subject.register(
    literal("redirected").redirect(subject.getRoot()),
  );
  const input = "redirected redirected actual";
  const parse = subject.parse(input, source);
  assertStrictEquals(parse.context.getRange().get(input), "redirected");
  assertStrictEquals(parse.context.getNodes().length, 1);
  assertStrictEquals(parse.context.getRootNode(), subject.getRoot());
  assert(
    parse.context.getRange()
      [Equatable.equals](parse.context.getNodes()[0].range),
  );
  assertStrictEquals(parse.context.getNodes()[0].node, redirectNode);
  const child1 = parse.context.getChild();
  assertExists(child1);
  assertStrictEquals(child1.getRange().get(input), "redirected");
  assertStrictEquals(child1.getNodes().length, 1);
  assertStrictEquals(child1.getRootNode(), subject.getRoot());
  assert(child1.getRange()[Equatable.equals](child1.getNodes()[0].range));
  assertStrictEquals(child1.getNodes()[0].node, redirectNode);
  const child2 = child1.getChild();
  assertExists(child2);
  assertStrictEquals(child2.getRange().get(input), "actual");
  assertStrictEquals(child2.getNodes().length, 1);
  assertStrictEquals(child2.getRootNode(), subject.getRoot());
  assert(child2.getRange()[Equatable.equals](child2.getNodes()[0].range));
  assertStrictEquals(child2.getNodes()[0].node, concreteNode);
  assertStrictEquals(await subject.execute(parse), 42);
  assertSpyCalls(command, 1);
});

Deno.test("correctExecuteContextAfterRedirect", async () => {
  const subject = new CommandDispatcher<number>();
  const root = subject.getRoot();
  const add = literal<number>("add");
  const blank = literal<number>("blank");
  const addArg = argument<number, number>("value", integer());
  const run = literal<number>("run");
  subject.register(
    add.then(
      addArg.redirect(
        root,
        (c) => c.getSource() + (c.getArgument("value") as number),
      ),
    ),
  );
  subject.register(blank.redirect(root));
  subject.register(run.executes((c) => c.getSource()));
  assertStrictEquals(await subject.execute("run", 0), 0);
  assertStrictEquals(await subject.execute("run", 1), 1);
  assertStrictEquals(await subject.execute("add 5 run", 1), 1 + 5);
  assertStrictEquals(await subject.execute("add 5 add 6 run", 2), 2 + 5 + 6);
  assertStrictEquals(await subject.execute("add 5 blank run", 1), 1 + 5);
  assertStrictEquals(await subject.execute("blank add 5 run", 1), 1 + 5);
  assertStrictEquals(
    await subject.execute("add 5 blank add 6 run", 2),
    2 + 5 + 6,
  );
  assertStrictEquals(
    await subject.execute("add 5 blank blank add 6 run", 2),
    2 + 5 + 6,
  );
});

Deno.test("sharedRedirectAndExecuteNodes", async () => {
  const subject = new CommandDispatcher<number>();
  const root = subject.getRoot();
  const add = literal<number>("add");
  const addArg = argument<number, number>("value", integer());
  subject.register(add.then(
    addArg
      .redirect(root, (c) => c.getSource() + (c.getArgument("value") as number))
      .executes((c) => c.getSource()),
  ));
  assertStrictEquals(await subject.execute("add 5", 1), 1);
  assertStrictEquals(await subject.execute("add 5 add 6", 1), 1 + 5);
});

Deno.test("executeRedirected", async () => {
  const command = spy((_c) => 42) satisfies Command<unknown>;
  const modifier = (c: CommandContext<unknown>) => {
    assertStrictEquals(c.getSource(), source);
    return [source1, source2];
  };
  const source1 = {};
  const source2 = {};
  const subject = new CommandDispatcher();
  const concreteNode = subject.register(literal("actual").executes(command));
  const redirectNode = subject.register(
    literal("redirected").fork(subject.getRoot(), modifier),
  );
  const input = "redirected actual";
  const parse = subject.parse(input, source);
  assertStrictEquals(parse.context.getRange().get(input), "redirected");
  assertStrictEquals(parse.context.getNodes().length, 1);
  assertStrictEquals(parse.context.getRootNode(), subject.getRoot());
  assert(
    parse.context.getRange()
      [Equatable.equals](parse.context.getNodes()[0].range),
  );
  assertStrictEquals(parse.context.getNodes()[0].node, redirectNode);
  assertStrictEquals(parse.context.getSource(), source);
  const parent = parse.context.getChild();
  assertExists(parent);
  assertStrictEquals(parent.getRange().get(input), "actual");
  assertStrictEquals(parent.getNodes().length, 1);
  assertStrictEquals(parent.getRootNode(), subject.getRoot());
  assert(parent.getRange()[Equatable.equals](parent.getNodes()[0].range));
  assertStrictEquals(parent.getNodes()[0].node, concreteNode);
  assertStrictEquals(parent.getSource(), source);
  assertStrictEquals(await subject.execute(parse), 2);
  assertSpyCalls(command, 2);
  assertStrictEquals(command.calls[0].args[0].getSource(), source1);
  assertStrictEquals(command.calls[1].args[0].getSource(), source2);
});

Deno.test("incompleteRedirectShouldThrow", async () => {
  const subject = new CommandDispatcher();
  const foo = subject.register(
    literal("foo")
      .then(
        literal("bar")
          .then(
            argument("value", integer())
              .executes((context) => context.getArgument<number>("value")),
          ),
      )
      .then(literal("awa").executes(() => 2)),
  );
  subject.register(literal("baz").redirect(foo));
  const e = await assertRejects(
    () => subject.execute("baz bar", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
});

Deno.test("redirectModifierEmptyResult", async () => {
  const subject = new CommandDispatcher();
  const foo = subject.register(
    literal("foo")
      .then(
        literal("bar")
          .then(
            argument("value", integer())
              .executes((context) => context.getArgument<number>("value")),
          ),
      )
      .then(literal("awa").executes(() => 2)),
  );
  const emptyModifier = () => [];
  subject.register(literal("baz").fork(foo, emptyModifier));
  const result = await subject.execute("baz bar 100", source);
  assertStrictEquals(result, 0);
});

Deno.test("executeOrphanedSubcommand", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo").then(argument("bar", integer())).executes(() => 0),
  );
  const e = await assertRejects(
    () => subject.execute("foo 5", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
  assertStrictEquals(e.cursor, 5);
});

Deno.test("execute invalidOther", async () => {
  const command = spy(() => 42);
  const wrongCommand = spy(() => 0);
  const subject = new CommandDispatcher();
  subject.register(literal("w").executes(wrongCommand));
  subject.register(literal("world").executes(command));
  assertStrictEquals(await subject.execute("world", source), 42);
  assertSpyCalls(wrongCommand, 0);
  assertSpyCalls(command, 1);
});

Deno.test("parse noSpaceSeparator", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo").then(argument("bar", integer()).executes(command)),
  );
  const e = await assertRejects(
    () => subject.execute("foo$", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.dispatcherUnknownCommand,
  );
  assertStrictEquals(e.cursor, 0);
});

Deno.test("executeInvalidSubcommand", async () => {
  const command = spy(() => 42);
  const subject = new CommandDispatcher();
  subject.register(
    literal("foo").then(argument("bar", integer())).executes(command),
  );
  const e = await assertRejects(
    () => subject.execute("foo bar", source),
    CommandSyntaxError,
  );
  assertStrictEquals(
    e.type,
    CommandSyntaxError.builtInErrors.readerExpectedInt,
  );
  assertStrictEquals(e.cursor, 4);
});

Deno.test("getPath", () => {
  const subject = new CommandDispatcher();
  const bar = literal("bar").build();
  subject.register(literal("foo").then(bar));
  assertEquals(subject.getPath(bar), ["foo", "bar"]);
});

Deno.test("findNodeExists", () => {
  const subject = new CommandDispatcher();
  const bar = literal("bar").build();
  subject.register(literal("foo").then(bar));
  assertStrictEquals(subject.findNode(["foo", "bar"]), bar);
});

Deno.test("findNodeDoesntExist", () => {
  const subject = new CommandDispatcher();
  assertStrictEquals(subject.findNode(["foo", "bar"]), undefined);
});

Deno.test("resultConsumerInNonErrorRun", async () => {
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("foo").executes(() => 5));
  assertStrictEquals(await subject.execute("foo", source), 5);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], true);
  assertStrictEquals(consumer.calls[0].args[2], 5);
});

Deno.test("resultConsumerInForkedNonErrorRun", async () => {
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("foo").executes((c) => c.getSource() as number));
  const contexts = [9, 10, 11];
  subject.register(literal("repeat").fork(subject.getRoot(), () => contexts));
  assertStrictEquals(
    await subject.execute("repeat foo", source),
    contexts.length,
  );
  assertSpyCalls(consumer, 3);
  assertStrictEquals(consumer.calls[0].args[0].getSource(), contexts[0]);
  assertStrictEquals(consumer.calls[0].args[1], true);
  assertStrictEquals(consumer.calls[0].args[2], 9);
  assertStrictEquals(consumer.calls[1].args[0].getSource(), contexts[1]);
  assertStrictEquals(consumer.calls[1].args[1], true);
  assertStrictEquals(consumer.calls[1].args[2], 10);
  assertStrictEquals(consumer.calls[2].args[0].getSource(), contexts[2]);
  assertStrictEquals(consumer.calls[2].args[1], true);
  assertStrictEquals(consumer.calls[2].args[2], 11);
});

function fail(error: unknown): never {
  throw error;
}

Deno.test("exceptionInNonForkedCommand", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("crash").executes(() => fail(error)));
  assertStrictEquals(
    await assertRejects(() => subject.execute("crash", source)),
    error,
  );
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
});

Deno.test("exceptionInNonForkedRedirectedCommand", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("crash").executes(() => fail(error)));
  subject.register(literal("redirect").redirect(subject.getRoot()));
  assertStrictEquals(
    await assertRejects(() => subject.execute("redirect crash", source)),
    error,
  );
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
});

Deno.test("exceptionInForkedRedirectedCommand", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("crash").executes(() => fail(error)));
  subject.register(literal("redirect").fork(subject.getRoot(), (c) => [c]));
  assertStrictEquals(await subject.execute("redirect crash", source), 0);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
});

Deno.test("exceptionInNonForkedRedirect", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const command = spy((_c) => 3) satisfies Command<unknown>;
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("noop").executes(command));
  subject.register(
    literal("redirect").redirect(subject.getRoot(), () => fail(error)),
  );
  assertStrictEquals(
    await assertRejects(() => subject.execute("redirect noop", source)),
    error,
  );
  assertSpyCalls(command, 0);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
});

Deno.test("exceptionInForkedRedirect", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const command = spy((_c) => 3) satisfies Command<unknown>;
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("noop").executes(command));
  subject.register(
    literal("redirect").fork(subject.getRoot(), () => fail(error)),
  );
  assertStrictEquals(await subject.execute("redirect noop", source), 0);
  assertSpyCalls(command, 0);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
});

Deno.test("partialExceptionInForkedRedirect", async () => {
  const error = CommandSyntaxError.builtInErrors.readerExpectedBool.create();
  const otherSource = {};
  const rejectedSource = {};
  const command = spy((_c) => 3) satisfies Command<unknown>;
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const subject = new CommandDispatcher();
  subject.setConsumer(consumer);
  subject.register(literal("run").executes(command));
  subject.register(
    literal("split")
      .fork(subject.getRoot(), () => [source, rejectedSource, otherSource]),
  );
  subject.register(
    literal("filter")
      .fork(subject.getRoot(), (context) => {
        const currentSource = context.getSource();
        if (currentSource === rejectedSource) {
          throw error;
        }
        return [currentSource];
      }),
  );
  assertStrictEquals(await subject.execute("split filter run", source), 2);
  assertSpyCalls(command, 2);
  assertStrictEquals(command.calls[0].args[0].getSource(), source);
  assertStrictEquals(command.calls[1].args[0].getSource(), otherSource);
  assertSpyCalls(consumer, 3);
  assertStrictEquals(consumer.calls[0].args[0].getSource(), rejectedSource);
  assertStrictEquals(consumer.calls[0].args[1], false);
  assertStrictEquals(consumer.calls[0].args[2], 0);
  assertStrictEquals(consumer.calls[1].args[0].getSource(), source);
  assertStrictEquals(consumer.calls[1].args[1], true);
  assertStrictEquals(consumer.calls[1].args[2], 3);
  assertStrictEquals(consumer.calls[2].args[0].getSource(), otherSource);
  assertStrictEquals(consumer.calls[2].args[1], true);
  assertStrictEquals(consumer.calls[2].args[2], 3);
});

Deno.test("allUsage noCommands", () => {
  const subject = new CommandDispatcher();
  const results = subject.getAllUsage(subject.getRoot(), source, true);
  assertStrictEquals(results.length, 0);
});

Deno.test("smartUsage noCommands", () => {
  const subject = new CommandDispatcher();
  const results = subject.getSmartUsage(subject.getRoot(), source);
  assertStrictEquals(results.size, 0);
});

const get = (
  subject: CommandDispatcher<unknown>,
  command: string | StringReader,
) => subject.parse(command, source).context.getNodes().at(-1)!.node;
const newUsageSubject = () => {
  const command = () => 0;
  const subject = new CommandDispatcher();
  subject.register(
    literal("a")
      .then(
        literal("1")
          .then(literal("i").executes(command))
          .then(literal("ii").executes(command)),
      )
      .then(
        literal("2")
          .then(literal("i").executes(command))
          .then(literal("ii").executes(command)),
      ),
  );
  subject.register(literal("b").then(literal("1").executes(command)));
  subject.register(literal("c").executes(command));
  subject.register(literal("d").requires(() => false).executes(command));
  subject.register(
    literal("e")
      .executes(command)
      .then(
        literal("1")
          .executes(command)
          .then(literal("i").executes(command))
          .then(literal("ii").executes(command)),
      ),
  );
  subject.register(
    literal("f")
      .then(
        literal("1")
          .then(literal("i").executes(command))
          .then(literal("ii").executes(command).requires(() => false)),
      )
      .then(
        literal("2")
          .then(literal("i").executes(command).requires(() => false))
          .then(literal("ii").executes(command)),
      ),
  );
  subject.register(
    literal("g")
      .executes(command)
      .then(literal("1").then(literal("i").executes(command))),
  );
  subject.register(
    literal("h")
      .executes(command)
      .then(literal("1").then(literal("i").executes(command)))
      .then(
        literal("2").then(literal("i").then(literal("ii").executes(command))),
      )
      .then(literal("3").executes(command)),
  );
  subject.register(
    literal("i")
      .executes(command)
      .then(literal("1").executes(command))
      .then(literal("2").executes(command)),
  );
  subject.register(literal("j").redirect(subject.getRoot()));
  subject.register(literal("k").redirect(get(subject, "h")));
  return subject;
};

Deno.test("allUsage root", () => {
  const subject = newUsageSubject();
  const results = subject.getAllUsage(subject.getRoot(), source, true);
  assertEquals(results, [
    "a 1 i",
    "a 1 ii",
    "a 2 i",
    "a 2 ii",
    "b 1",
    "c",
    "e",
    "e 1",
    "e 1 i",
    "e 1 ii",
    "f 1 i",
    "f 2 ii",
    "g",
    "g 1 i",
    "h",
    "h 1 i",
    "h 2 i ii",
    "h 3",
    "i",
    "i 1",
    "i 2",
    "j ...",
    "k -> h",
  ]);
});

Deno.test("smartUsage root", () => {
  const subject = newUsageSubject();
  const results = subject.getSmartUsage(subject.getRoot(), source);
  assertEquals(
    results,
    new Map([
      [get(subject, "a"), "a (1|2)"],
      [get(subject, "b"), "b 1"],
      [get(subject, "c"), "c"],
      [get(subject, "e"), "e [1]"],
      [get(subject, "f"), "f (1|2)"],
      [get(subject, "g"), "g [1]"],
      [get(subject, "h"), "h [1|2|3]"],
      [get(subject, "i"), "i [1|2]"],
      [get(subject, "j"), "j ..."],
      [get(subject, "k"), "k -> h"],
    ]),
  );
});

Deno.test("smartUsage h", () => {
  const subject = newUsageSubject();
  const results = subject.getSmartUsage(get(subject, "h"), source);
  assertEquals(
    results,
    new Map([
      [get(subject, "h 1"), "[1] i"],
      [get(subject, "h 2"), "[2] i ii"],
      [get(subject, "h 3"), "[3]"],
    ]),
  );
});

Deno.test("smartUsage offsetH", () => {
  const subject = newUsageSubject();
  const results = subject.getSmartUsage(
    get(subject, offset("/|/|/h", 5)),
    source,
  );
  assertEquals(
    results,
    new Map([
      [get(subject, "h 1"), "[1] i"],
      [get(subject, "h 2"), "[2] i ii"],
      [get(subject, "h 3"), "[3]"],
    ]),
  );
});

function assertSuggestions(
  suggestions: Suggestions,
  range: StringRange,
  texts: readonly string[],
): undefined {
  assert(range[Equatable.equals](suggestions.range));
  assert(
    tupleEqualer.equals(
      texts.map((text) => new Suggestion(range, text)),
      suggestions.list,
    ),
  );
}

Deno.test("getCompletionSuggestions rootCommands", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo"));
  subject.register(literal("bar"));
  subject.register(literal("baz"));
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("", source)),
    StringRange.at(0),
    ["bar", "baz", "foo"],
  );
});

Deno.test("getCompletionSuggestions rootCommands withInputOffset", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo"));
  subject.register(literal("bar"));
  subject.register(literal("baz"));
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse(offset("OOO", 3), source),
    ),
    StringRange.at(3),
    ["bar", "baz", "foo"],
  );
});

Deno.test("getCompletionSuggestions rootCommands partial", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo"));
  subject.register(literal("bar"));
  subject.register(literal("baz"));
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("b", source)),
    StringRange.between(0, 1),
    ["bar", "baz"],
  );
});

Deno.test("getCompletionSuggestions rootCommands partial withInputOffset", async () => {
  const subject = new CommandDispatcher();
  subject.register(literal("foo"));
  subject.register(literal("bar"));
  subject.register(literal("baz"));
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse(offset("Zb", 1), source),
    ),
    StringRange.between(1, 2),
    ["bar", "baz"],
  );
});

Deno.test("getCompletionSuggestions subCommands", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("parent")
      .then(literal("foo"))
      .then(literal("bar"))
      .then(literal("baz")),
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("parent ", source)),
    StringRange.at(7),
    ["bar", "baz", "foo"],
  );
});

Deno.test("getCompletionSuggestions movingCursor subCommands", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("parent_one")
      .then(literal("faz"))
      .then(literal("fbz"))
      .then(literal("gaz")),
  );
  subject.register(
    literal("parent_two"),
  );
  const parse = subject.parse("parent_one faz ", source);
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 0),
    StringRange.at(0),
    ["parent_one", "parent_two"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 1),
    StringRange.between(0, 1),
    ["parent_one", "parent_two"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 7),
    StringRange.between(0, 7),
    ["parent_one", "parent_two"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 8),
    StringRange.between(0, 8),
    ["parent_one"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 10),
    StringRange.at(0),
    [],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 11),
    StringRange.at(11),
    ["faz", "fbz", "gaz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 12),
    StringRange.between(11, 12),
    ["faz", "fbz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 13),
    StringRange.between(11, 13),
    ["faz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 14),
    StringRange.at(0),
    [],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 15),
    StringRange.at(0),
    [],
  );
});

Deno.test("getCompletionSuggestions subCommands partial", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("parent")
      .then(literal("foo"))
      .then(literal("bar"))
      .then(literal("baz")),
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("parent b", source)),
    StringRange.between(7, 8),
    ["bar", "baz"],
  );
});

Deno.test("getCompletionSuggestions subCommands partial withInputOffset", async () => {
  const subject = new CommandDispatcher();
  subject.register(
    literal("parent")
      .then(literal("foo"))
      .then(literal("bar"))
      .then(literal("baz")),
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse(offset("junk parent b", 5), source),
    ),
    StringRange.between(12, 13),
    ["bar", "baz"],
  );
});

Deno.test("getCompletionSuggestions redirect", async () => {
  const subject = new CommandDispatcher();
  const actual = subject.register(literal("actual").then(literal("sub")));
  subject.register(literal("redirect").redirect(actual));
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("redirect ", source)),
    StringRange.at(9),
    ["sub"],
  );
});

Deno.test("getCompletionSuggestions redirectPartial", async () => {
  const subject = new CommandDispatcher();
  const actual = subject.register(literal("actual").then(literal("sub")));
  subject.register(literal("redirect").redirect(actual));
  assertSuggestions(
    await subject.getCompletionSuggestions(subject.parse("redirect s", source)),
    StringRange.between(9, 10),
    ["sub"],
  );
});

Deno.test("getCompletionSuggestions movingCursor redirect", async () => {
  const subject = new CommandDispatcher();
  const actualOne = subject.register(
    literal("actual_one")
      .then(literal("faz"))
      .then(literal("fbz"))
      .then(literal("gaz")),
  );
  const actualTwo = subject.register(literal("actual_two"));
  subject.register(literal("redirect_one").redirect(actualOne));
  subject.register(literal("redirect_two").redirect(actualTwo));
  const parse = subject.parse("redirect_one faz ", source);
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 0),
    StringRange.at(0),
    ["actual_one", "actual_two", "redirect_one", "redirect_two"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 9),
    StringRange.between(0, 9),
    ["redirect_one", "redirect_two"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 10),
    StringRange.between(0, 10),
    ["redirect_one"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 12),
    StringRange.at(0),
    [],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 13),
    StringRange.at(13),
    ["faz", "fbz", "gaz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 14),
    StringRange.between(13, 14),
    ["faz", "fbz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 15),
    StringRange.between(13, 15),
    ["faz"],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 16),
    StringRange.at(0),
    [],
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(parse, 17),
    StringRange.at(0),
    [],
  );
});

Deno.test("getCompletionSuggestions redirectPartial withInputOffset", async () => {
  const subject = new CommandDispatcher();
  const actual = subject.register(literal("actual").then(literal("sub")));
  subject.register(literal("redirect").redirect(actual));
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse(offset("/redirect s", 1), source),
    ),
    StringRange.between(10, 11),
    ["sub"],
  );
});

Deno.test("getCompletionSuggestions redirect lots", async () => {
  const subject = new CommandDispatcher();
  const redirectNode = ref.out<CommandNode<unknown>>();
  subject.register(
    literal("redirect")
      .addTo(subject.getRoot(), redirectNode)
      .then(
        literal("loop")
          .then(argument("loop", integer()).redirect(redirectNode.value)),
      ),
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse("redirect loop 1 loop 02 loop 003 ", source),
    ),
    StringRange.at(33),
    ["loop"],
  );
});

Deno.test("getCompletionSuggestions execute simulation", async () => {
  const subject = new CommandDispatcher();
  const executeNode = ref.out<CommandNode<unknown>>();
  subject.register(
    literal("execute")
      .addTo(subject.getRoot(), executeNode)
      .then(
        literal("as")
          .then(argument("name", word()).redirect(executeNode.value)),
      )
      .then(
        literal("store")
          .then(argument("name", word()).redirect(executeNode.value)),
      )
      .then(literal("run").executes(() => 0)),
  );
  const result = await subject.getCompletionSuggestions(
    subject.parse("execute as Dinnerbone as", source),
  );
  assertStrictEquals(result.isEmpty(), true);
});

Deno.test("getCompletionSuggestions execute simulation partial", async () => {
  const subject = new CommandDispatcher();
  const executeNode = ref.out<CommandNode<unknown>>();
  subject.register(
    literal("execute")
      .addTo(subject.getRoot(), executeNode)
      .then(
        literal("as")
          .then(literal("bar").redirect(executeNode.value))
          .then(literal("baz").redirect(executeNode.value)),
      )
      .then(
        literal("store")
          .then(argument("name", word()).redirect(executeNode.value)),
      )
      .then(literal("run").executes(() => 0)),
  );
  assertSuggestions(
    await subject.getCompletionSuggestions(
      subject.parse("execute as bar as ", source),
    ),
    StringRange.at(18),
    ["bar", "baz"],
  );
});
