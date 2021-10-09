import type { CommandContext } from "../context/CommandContext.ts";
import type { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";

export type SuggestionProvider<S> = (
  context: CommandContext<S>,
  builder: SuggestionsBuilder,
) => Promise<Suggestions>;
