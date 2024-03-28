import { assert } from "@std/assert/assert";
import { assertStrictEquals } from "@std/assert/assert-strict-equals";
import { assertSpyCalls, spy } from "@std/testing/mock";

import type { Command } from "../Command.ts";
import { CommandDispatcher } from "../CommandDispatcher.ts";
import type { ResultConsumer } from "../ResultConsumer.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { ContextChain } from "./ContextChain.ts";

Deno.test("executeAllForSingleCommand", async () => {
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const command = spy((_c) => 4) satisfies Command<unknown>;
  const dispatcher = new CommandDispatcher();
  dispatcher.register(literal("foo").executes(command));
  const source = "compile_source";
  const result = dispatcher.parse("foo", source);
  const topContext = result.context.build("foo");
  const chain = ContextChain.tryFlatten(topContext);
  assert(chain);
  const runtimeSource = "runtime_source";
  assertStrictEquals(await chain.executeAll(runtimeSource, consumer), 4);
  assertSpyCalls(command, 1);
  assertStrictEquals(command.calls[0].args[0].getSource(), runtimeSource);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[0].getSource(), runtimeSource);
  assertStrictEquals(consumer.calls[0].args[1], true);
  assertStrictEquals(consumer.calls[0].args[2], 4);
});

Deno.test("executeAllForRedirectedCommand", async () => {
  const consumer = spy() satisfies ResultConsumer<unknown>;
  const command = spy((_c) => 4) satisfies Command<unknown>;
  const redirectedSource = "redirected_source";
  const dispatcher = new CommandDispatcher();
  dispatcher.register(literal("foo").executes(command));
  dispatcher.register(
    literal("bar").redirect(dispatcher.getRoot(), () => redirectedSource),
  );
  const source = "compile_source";
  const result = dispatcher.parse("bar foo", source);
  const topContext = result.context.build("bar foo");
  const chain = ContextChain.tryFlatten(topContext);
  assert(chain);
  const runtimeSource = "runtime_source";
  assertStrictEquals(await chain.executeAll(runtimeSource, consumer), 4);
  assertSpyCalls(command, 1);
  assertStrictEquals(command.calls[0].args[0].getSource(), redirectedSource);
  assertSpyCalls(consumer, 1);
  assertStrictEquals(consumer.calls[0].args[0].getSource(), redirectedSource);
  assertStrictEquals(consumer.calls[0].args[1], true);
  assertStrictEquals(consumer.calls[0].args[2], 4);
});

Deno.test("singleStageExecution", () => {
  const dispatcher = new CommandDispatcher();
  dispatcher.register(literal("foo").executes(() => 1));
  const source = {};
  const result = dispatcher.parse("foo", source);
  const topContext = result.context.build("foo");
  const chain = ContextChain.tryFlatten(topContext);
  assert(chain);
  assertStrictEquals(chain.getStage(), "execute");
  assertStrictEquals(chain.getTopContext(), topContext);
  assertStrictEquals(chain.nextStage(), undefined);
});

Deno.test("multiStageExecution", () => {
  const dispatcher = new CommandDispatcher();
  dispatcher.register(literal("foo").executes(() => 1));
  dispatcher.register(literal("bar").redirect(dispatcher.getRoot()));
  const source = {};
  const result = dispatcher.parse("bar bar foo", source);
  const topContext = result.context.build("bar bar foo");
  const stage0 = ContextChain.tryFlatten(topContext);
  assert(stage0);
  assertStrictEquals(stage0.getStage(), "modify");
  assertStrictEquals(stage0.getTopContext(), topContext);
  const stage1 = stage0.nextStage();
  assert(stage1);
  assertStrictEquals(stage1.getStage(), "modify");
  assertStrictEquals(stage1.getTopContext(), topContext.getChild()!);
  const stage2 = stage1.nextStage();
  assert(stage2);
  assertStrictEquals(stage2.getStage(), "execute");
  assertStrictEquals(
    stage2.getTopContext(),
    topContext.getChild()!.getChild()!,
  );
  assert(!stage2.nextStage());
});

Deno.test("missingExecute", () => {
  const dispatcher = new CommandDispatcher();
  dispatcher.register(literal("foo").executes(() => 1));
  dispatcher.register(literal("bar").redirect(dispatcher.getRoot()));
  const source = new Object();
  const result = dispatcher.parse("bar bar", source);
  const topContext = result.context.build("bar bar");
  assert(!ContextChain.tryFlatten(topContext));
});
