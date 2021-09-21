import { StringRange } from "../context/StringRange.ts";
import type { Message } from "../Message.ts";
import { Suggestion } from "../suggestion/Suggestion.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";

export class SuggestionsBuilder {
  readonly input: string;
  readonly start: number;
  readonly remaining: string;
  readonly remainingLowerCase: string;
  readonly #inputLowerCase: string;
  readonly #result: Suggestion[] = [];

  constructor(input: string, inputLowerCase: string, start: number) {
    this.input = input;
    this.#inputLowerCase = inputLowerCase;
    this.start = start;
    this.remaining = input.substring(start);
    this.remainingLowerCase = inputLowerCase.substring(start);
  }

  build(): Suggestions {
    return Suggestions.create(this.input, this.#result);
  }

  buildPromise(): Promise<Suggestions> {
    return Promise.resolve(this.build());
  }

  suggest(text: string, tooltip?: Message): SuggestionsBuilder {
    if (text === this.remaining)
      return this;
    this.#result.push(new Suggestion(StringRange.between(this.start, this.input.length), text, tooltip));
    return this;
  }

  add(other: SuggestionsBuilder): SuggestionsBuilder {
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
