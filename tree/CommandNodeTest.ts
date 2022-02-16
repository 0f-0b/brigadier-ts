import { assertStrictEquals } from "../test_deps.ts";
import { assertIterator } from "../test_util.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import { CommandDispatcher } from "../CommandDispatcher.ts";
import { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import { CommandNode } from "./CommandNode.ts";
import { RootCommandNode } from "./RootCommandNode.ts";

export const command = () => 0;
export const newContextBuilder = () =>
  new CommandContextBuilder(
    new CommandDispatcher(),
    {},
    new RootCommandNode(),
    0,
  );

export function genericCommandNodeTest(
  newNode: () => CommandNode<unknown>,
): void {
  Deno.test("addChild", () => {
    const node = newNode();
    node.addChild(literal("child1").build());
    node.addChild(literal("child2").build());
    node.addChild(literal("child1").build());
    assertIterator(node.getChildren(), [Object, Object]);
  });

  Deno.test("addChildMergesGrandchildren", () => {
    const node = newNode();
    node.addChild(literal("child").then(literal("grandchild1")).build());
    node.addChild(literal("child").then(literal("grandchild2")).build());
    assertIterator(node.getChildren(), [
      (x) => assertIterator(x.getChildren(), [Object, Object]),
    ]);
  });

  Deno.test("addChildPreservesCommand", () => {
    const node = newNode();
    node.addChild(literal("child").executes(command).build());
    node.addChild(literal("child").build());
    assertIterator(node.getChildren(), [
      (x) => assertStrictEquals(x.getCommand(), command),
    ]);
  });

  Deno.test("addChildOverwritesCommand", () => {
    const node = newNode();
    node.addChild(literal("child").build());
    node.addChild(literal("child").executes(command).build());
    assertIterator(node.getChildren(), [
      (x) => assertStrictEquals(x.getCommand(), command),
    ]);
  });
}
