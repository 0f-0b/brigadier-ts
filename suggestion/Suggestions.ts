import {
  combineHashes,
  defaultComparer,
  Equatable,
  tupleEqualer,
} from "@esfx/equatable";
import { maxOf } from "@std/collections/max-of";
import { minOf } from "@std/collections/min-of";

import { StringRange } from "../context/StringRange.ts";
import type { Suggestion } from "../suggestion/Suggestion.ts";

export class Suggestions implements Equatable {
  static readonly EMPTY: Suggestions = new Suggestions(StringRange.at(0), []);
  readonly range: StringRange;
  readonly list: readonly Suggestion[];

  constructor(range: StringRange, suggestions: Suggestion[]) {
    this.range = range;
    this.list = suggestions;
  }

  isEmpty(): boolean {
    return this.list.length === 0;
  }

  [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof Suggestions &&
      this.range[Equatable.equals](other.range) &&
      tupleEqualer.equals(this.list, other.list));
  }

  [Equatable.hash](): number {
    return combineHashes(
      this.range[Equatable.hash](),
      tupleEqualer.hash(this.list),
    );
  }

  static empty(): Promise<Suggestions> {
    return Promise.resolve(this.EMPTY);
  }

  static merge(command: string, input: readonly Suggestions[]): Suggestions {
    switch (input.length) {
      case 0:
        return this.EMPTY;
      case 1:
        return input[0];
      default: {
        const texts = new Set<Suggestion>();
        for (const suggestions of input) {
          for (const suggestion of suggestions.list) {
            texts.add(suggestion);
          }
        }
        return this.create(command, Array.from(texts));
      }
    }
  }

  static create(
    command: string,
    suggestions: readonly Suggestion[],
  ): Suggestions {
    if (suggestions.length === 0) {
      return this.EMPTY;
    }
    const start = minOf(suggestions, (suggestion) => suggestion.range.start)!;
    const end = maxOf(suggestions, (suggestion) => suggestion.range.end)!;
    const range = new StringRange(start, end);
    const texts = new Set<Suggestion>();
    for (const suggestion of suggestions) {
      texts.add(suggestion.expand(command, range));
    }
    const sorted = Array.from(texts);
    sorted.sort(defaultComparer.compare);
    return new Suggestions(range, sorted);
  }
}
