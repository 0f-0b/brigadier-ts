import type { CommandContextBuilder } from "./context/CommandContextBuilder.ts";
import type { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import type { ImmutableStringReader } from "./ImmutableStringReader.ts";
import type { CommandNode } from "./tree/CommandNode.ts";

export class ParseResults<S> {
  readonly context: CommandContextBuilder<S>;
  readonly reader: ImmutableStringReader;
  readonly errors: Map<CommandNode<S>, CommandSyntaxError>;

  constructor(
    context: CommandContextBuilder<S>,
    reader: ImmutableStringReader,
    errors: Map<CommandNode<S>, CommandSyntaxError>,
  ) {
    this.context = context;
    this.reader = reader;
    this.errors = errors;
  }
}
