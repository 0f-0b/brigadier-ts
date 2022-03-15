import type { Message } from "../Message.ts";
import { StringRange } from "../context/StringRange.ts";
import { NumberSuggestion } from "./NumberSuggestion.ts";
import { Suggestion } from "./Suggestion.ts";
import { Suggestions } from "./Suggestions.ts";

export class SuggestionsBuilder {
  readonly input: string;
  readonly start: number;
  readonly remaining: string;
  readonly remainingLowerCase: string;
  readonly #inputLowerCase: string;
  readonly #result: Suggestion[] = [];

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

  suggest(text: string | number, tooltip?: Message): this {
    if (typeof text === "number") {
      this.#result.push(
        new NumberSuggestion(
          StringRange.between(this.start, this.input.length),
          text,
          tooltip,
        ),
      );
    } else if (text !== this.remaining) {
      this.#result.push(
        new Suggestion(
          StringRange.between(this.start, this.input.length),
          text,
          tooltip,
        ),
      );
    }
    return this;
  }

  add(other: SuggestionsBuilder): this {
    this.#result.push(...other.#result);
    return this;
  }

  createOffset(start: number): SuggestionsBuilder {
    return new SuggestionsBuilder(this.input, this.#inputLowerCase, start);
  }

  restart(): SuggestionsBuilder {
    return this.createOffset(this.start);
  }
}
