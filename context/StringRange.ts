import { combineHashes, Equatable, rawHash } from "@esfx/equatable";

import type { ImmutableStringReader } from "../ImmutableStringReader.ts";
import { mixinEquatable } from "../mixin_equatable.ts";

export class StringRange implements Equatable {
  readonly start: number;
  readonly end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  static at(pos: number): StringRange {
    return new StringRange(pos, pos);
  }

  static between(start: number, end: number): StringRange {
    return new StringRange(start, end);
  }

  static encompassing(a: StringRange, b: StringRange): StringRange {
    return new StringRange(Math.min(a.start, b.start), Math.max(a.end, b.end));
  }

  get(str: string | ImmutableStringReader): string {
    if (typeof str !== "string") {
      str = str.getString();
    }
    return str.substring(this.start, this.end);
  }

  isEmpty(): boolean {
    return this.start === this.end;
  }

  getLength(): number {
    return this.end - this.start;
  }

  _equals(other: this): boolean {
    return this.start === other.start && this.end === other.end;
  }

  _hash(): number {
    return combineHashes(rawHash(this.start), rawHash(this.end));
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
