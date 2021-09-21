import type { CommandContext } from "../context/CommandContext.ts";
import type { StringReader } from "../StringReader.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";

export abstract class ArgumentType<T> {
  abstract parse(reader: StringReader): T;

  listSuggestions<S>(_context: CommandContext<S>, _builder: SuggestionsBuilder): Promise<Suggestions> {
    return Suggestions.empty();
  }

  getExamples(): Iterable<string> {
    return [];
  }
}
