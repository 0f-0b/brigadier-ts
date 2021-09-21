import type { CommandNode } from "../CommandNode.ts";
import type { StringRange } from "./StringRange.ts";

export class ParsedCommandNode<S> {
  readonly node: CommandNode<S>;
  readonly range: StringRange;

  constructor(node: CommandNode<S>, range: StringRange) {
    this.node = node;
    this.range = range;
  }
}
