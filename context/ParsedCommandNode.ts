import { combineHashes, Equatable } from "@esfx/equatable";

import { mixinEquatable } from "../mixin_equatable.ts";
import type { CommandNode } from "../tree/CommandNode.ts";
import type { StringRange } from "./StringRange.ts";

export class ParsedCommandNode<S> implements Equatable {
  readonly node: CommandNode<S>;
  readonly range: StringRange;

  constructor(node: CommandNode<S>, range: StringRange) {
    this.node = node;
    this.range = range;
  }

  _equals(other: this): boolean {
    return this.node[Equatable.equals](other.node) &&
      this.range[Equatable.equals](other.range);
  }

  _hash(): number {
    return combineHashes(
      this.node[Equatable.hash](),
      this.range[Equatable.hash](),
    );
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
