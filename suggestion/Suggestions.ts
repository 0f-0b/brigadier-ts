import { ReadonlyCollection } from "@esfx/collection-core";
import { HashSet } from "@esfx/collections-hashset";
import {
  combineHashes,
  Comparable,
  Equatable,
  tupleEqualer,
} from "@esfx/equatable";
import { maxOf } from "@std/collections/max-of";
import { minOf } from "@std/collections/min-of";

import { StringRange } from "../context/StringRange.ts";
import { mixinEquatable } from "../mixin_equatable.ts";
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

  _equals(other: this): boolean {
    return this.range[Equatable.equals](other.range) &&
      tupleEqualer.equals(this.list, other.list);
  }

  _hash(): number {
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
        const texts = new HashSet<Suggestion>();
        for (const suggestions of input) {
          for (const suggestion of suggestions.list) {
            texts.add(suggestion);
          }
        }
        return this.create(command, texts);
      }
    }
  }

  static create(
    command: string,
    suggestions: ReadonlyCollection<Suggestion>,
  ): Suggestions {
    if (suggestions[ReadonlyCollection.size] === 0) {
      return this.EMPTY;
    }
    const start = minOf(suggestions, (suggestion) => suggestion.range.start)!;
    const end = maxOf(suggestions, (suggestion) => suggestion.range.end)!;
    const range = new StringRange(start, end);
    const texts = new HashSet<Suggestion>();
    for (const suggestion of suggestions) {
      texts.add(suggestion.expand(command, range));
    }
    const sorted = Array.from(texts);
    sorted.sort((a, b) =>
      a.compareToIgnoreCase(b) || a[Comparable.compareTo](b)
    );
    return new Suggestions(range, sorted);
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
