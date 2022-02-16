import type { Equatable } from "../deps.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { StringReader } from "../StringReader.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";

export abstract class ArgumentType<T> implements Equatable {
  abstract parse(reader: StringReader): T;

  listSuggestions<S>(
    _context: CommandContext<S>,
    _builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    return Suggestions.empty();
  }

  abstract [Equatable.equals](other: unknown): boolean;

  abstract [Equatable.hash](): number;

  getExamples(): Iterable<string> {
    return [];
  }
}
