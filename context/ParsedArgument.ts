import { combineHashes, defaultEqualer, Equatable } from "@esfx/equatable";

import { mixinEquatable } from "../mixin_equatable.ts";
import { StringRange } from "./StringRange.ts";

export class ParsedArgument<T> implements Equatable {
  readonly range: StringRange;
  readonly result: T;

  constructor(start: number, end: number, result: T) {
    this.range = StringRange.between(start, end);
    this.result = result;
  }

  _equals(other: this): boolean {
    return this.range[Equatable.equals](other.range) &&
      defaultEqualer.equals(this.result, other.result);
  }

  _hash(): number {
    return combineHashes(
      this.range[Equatable.hash](),
      defaultEqualer.hash(this.result),
    );
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
