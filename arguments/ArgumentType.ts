import { Equatable } from "@esfx/equatable";

import type { CommandContext } from "../context/CommandContext.ts";
import { mixinEquatable } from "../mixin_equatable.ts";
import type { StringReader } from "../StringReader.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";

export abstract class ArgumentType<T> implements Equatable {
  abstract parse(reader: StringReader): T;

  parseFor<S>(reader: StringReader, _source: S): T {
    return this.parse(reader);
  }

  listSuggestions<S>(
    _context: CommandContext<S>,
    _builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    return Suggestions.empty();
  }

  abstract _equals(other: this): boolean;

  abstract _hash(): number;

  getExamples(): Iterable<string> {
    return [];
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
