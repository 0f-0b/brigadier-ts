import type { CommandNode } from "./tree/CommandNode.ts";

export type AmbiguityConsumer<S> = (
  parent: CommandNode<S>,
  child: CommandNode<S>,
  sibling: CommandNode<S>,
  inputs: Iterable<string>,
) => unknown;
