import { StringRange } from "../context/StringRange.ts";
import type { Suggestion } from "../suggestion/Suggestion.ts";
import { addAll, maxOf, minOf } from "../util.ts";

export class Suggestions {
  static readonly EMPTY = new Suggestions(StringRange.at(0), []);
  readonly range: StringRange;
  readonly list: Suggestion[];

  constructor(range: StringRange, suggestions: Suggestion[]) {
    this.range = range;
    this.list = suggestions;
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
        for (const suggestions of input)
          addAll(texts, suggestions.list);
        return this.create(command, Array.from(texts));
      }
    }
  }

  static create(command: string, suggestions: readonly Suggestion[]): Suggestions {
    if (suggestions.length === 0)
      return this.EMPTY;
    const start = minOf(suggestions, suggestion => suggestion.range.start);
    const end = maxOf(suggestions, suggestion => suggestion.range.end);
    const range = new StringRange(start, end);
    const texts = new Set<Suggestion>();
    for (const suggestion of suggestions)
      texts.add(suggestion.expand(command, range));
    const sorted = Array.from(texts);
    sorted.sort((a, b) => {
      const as = a.text.toLowerCase();
      const bs = b.text.toLowerCase();
      return as > bs ? 1 : as < bs ? -1 : 0;
    });
    return new Suggestions(range, sorted);
  }
}
