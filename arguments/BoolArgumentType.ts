import type { CommandContext } from "../context/CommandContext.ts";
import type { StringReader } from "../StringReader.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { ArgumentType } from "./ArgumentType.ts";

export class BoolArgumentType extends ArgumentType<boolean> {
  override parse(reader: StringReader): boolean {
    return reader.readBoolean();
  }

  override listSuggestions<S>(_context: CommandContext<S>, builder: SuggestionsBuilder): Promise<Suggestions> {
    if ("true".startsWith(builder.remaining.toLowerCase()))
      builder.suggest("true");
    if ("false".startsWith(builder.remaining.toLowerCase()))
      builder.suggest("false");
    return builder.buildPromise();
  }

  override getExamples(): Iterable<string> {
    return ["true", "false"];
  }
}

export function bool(): BoolArgumentType {
  return new BoolArgumentType();
}
