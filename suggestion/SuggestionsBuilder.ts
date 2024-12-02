import { HashSet } from "@esfx/collections-hashset";

import { StringRange } from "../context/StringRange.ts";
import type { Message } from "../Message.ts";
import { NumberSuggestion } from "./NumberSuggestion.ts";
import { Suggestion } from "./Suggestion.ts";
import { Suggestions } from "./Suggestions.ts";

export class SuggestionsBuilder {
  readonly input: string;
  readonly start: number;
  readonly remaining: string;
  readonly remainingLowerCase: string;
  readonly #inputLowerCase: string;
  readonly #result = new HashSet<Suggestion>();

  constructor(input: string, start: number);
  constructor(input: string, inputLowerCase: string, start: number);
  constructor(input: string, inputLowerCase: string | number, start?: number) {
    if (typeof inputLowerCase === "number") {
      start = inputLowerCase;
      inputLowerCase = input.toLowerCase();
    }
    this.input = input;
    this.#inputLowerCase = inputLowerCase;
    this.start = start!;
    this.remaining = input.substring(start!);
    this.remainingLowerCase = inputLowerCase.substring(start!);
  }

  build(): Suggestions {
    return Suggestions.create(this.input, this.#result);
  }

  buildPromise(): Promise<Suggestions> {
    return Promise.resolve(this.build());
  }

  suggest(textOrValue: string | number, tooltip?: Message): this {
    if (typeof textOrValue === "number") {
      this.#result.add(
        new NumberSuggestion(
          StringRange.between(this.start, this.input.length),
          textOrValue,
          tooltip,
        ),
      );
    } else if (textOrValue !== this.remaining) {
      this.#result.add(
        new Suggestion(
          StringRange.between(this.start, this.input.length),
          textOrValue,
          tooltip,
        ),
      );
    }
    return this;
  }

  add(other: SuggestionsBuilder): this {
    for (const suggestion of other.#result) {
      this.#result.add(suggestion);
    }
    return this;
  }

  createOffset(start: number): SuggestionsBuilder {
    return new SuggestionsBuilder(this.input, this.#inputLowerCase, start);
  }

  restart(): SuggestionsBuilder {
    return this.createOffset(this.start);
  }
}
