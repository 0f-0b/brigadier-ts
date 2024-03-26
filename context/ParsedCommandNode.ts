import { combineHashes, Equatable } from "@esfx/equatable";

import type { CommandNode } from "../tree/CommandNode.ts";
import type { StringRange } from "./StringRange.ts";

export class ParsedCommandNode<S> implements Equatable {
  readonly node: CommandNode<S>;
  readonly range: StringRange;

  constructor(node: CommandNode<S>, range: StringRange) {
    this.node = node;
    this.range = range;
  }

  [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof ParsedCommandNode &&
      this.node[Equatable.equals](other.node) &&
      this.range[Equatable.equals](other.range));
  }

  [Equatable.hash](): number {
    return combineHashes(
      this.node[Equatable.hash](),
      this.range[Equatable.hash](),
    );
  }
}
