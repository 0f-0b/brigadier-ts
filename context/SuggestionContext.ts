import type { CommandNode } from "../tree/CommandNode.ts";

export class SuggestionContext<S> {
  readonly parent: CommandNode<S>;
  readonly startPos: number;

  constructor(parent: CommandNode<S>, startPos: number) {
    this.parent = parent;
    this.startPos = startPos;
  }
}
