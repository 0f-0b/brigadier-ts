import {
  combineHashes,
  Comparable,
  Equatable,
  rawHash,
} from "../deps/@esfx/equatable.ts";
import { Message } from "../Message.ts";
import { StringRange } from "../context/StringRange.ts";
import { Suggestion } from "./Suggestion.ts";

export class NumberSuggestion extends Suggestion {
  readonly value: number;

  constructor(range: StringRange, value: number, tooltip?: Message) {
    super(range, value.toString(), tooltip);
    this.value = value;
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof NumberSuggestion &&
      super[Equatable.equals](other) && this.value === other.value);
  }

  override [Equatable.hash](): number {
    return combineHashes(super[Equatable.hash](), rawHash(this.value));
  }

  override [Comparable.compareTo](other: Suggestion): number {
    if (other instanceof NumberSuggestion) {
      return this.value - other.value;
    }
    return super[Comparable.compareTo](other);
  }
}
