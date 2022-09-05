import {
  combineHashes,
  Comparable,
  defaultComparer,
  defaultEqualer,
  Equatable,
  rawHash,
} from "../deps/esfx/equatable.ts";

import type { StringRange } from "../context/StringRange.ts";
import type { Message } from "../Message.ts";

export class Suggestion implements Equatable, Comparable {
  readonly range: StringRange;
  readonly text: string;
  readonly tooltip?: Message;

  constructor(range: StringRange, text: string, tooltip?: Message) {
    this.range = range;
    this.text = text;
    this.tooltip = tooltip;
  }

  apply(input: string): string {
    if (this.range.start === 0 && this.range.end === input.length) {
      return this.text;
    }
    let result = "";
    if (this.range.start > 0) {
      result += input.substring(0, this.range.start);
    }
    result += this.text;
    if (this.range.end < input.length) {
      result += input.substring(this.range.end);
    }
    return result;
  }

  [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof Suggestion &&
      this.range[Equatable.equals](other.range) &&
      this.text === other.text &&
      defaultEqualer.equals(this.tooltip, other.tooltip));
  }

  [Equatable.hash](): number {
    return combineHashes(
      combineHashes(this.range[Equatable.hash](), rawHash(this.text)),
      defaultEqualer.hash(this.tooltip),
    );
  }

  [Comparable.compareTo](other: Suggestion): number {
    return defaultComparer.compare(
      this.text.toLowerCase(),
      other.text.toLowerCase(),
    );
  }

  expand(command: string, range: StringRange): Suggestion {
    if (range.start === this.range.start && range.end === this.range.end) {
      return this;
    }
    let result = "";
    if (range.start < this.range.start) {
      result += command.substring(range.start, this.range.start);
    }
    result += this.text;
    if (range.end > this.range.end) {
      result += command.substring(this.range.end, range.end);
    }
    return new Suggestion(range, result, this.tooltip);
  }
}
