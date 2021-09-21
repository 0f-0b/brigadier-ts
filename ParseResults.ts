import type { CommandNode } from "./CommandNode.ts";
import type { CommandContextBuilder } from "./context/CommandContextBuilder.ts";
import type { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import type { ImmutableStringReader } from "./ImmutableStringReader.ts";

export class ParseResults<S> {
  readonly context: CommandContextBuilder<S>;
  readonly errors: Map<CommandNode<S>, CommandSyntaxError>;
  readonly reader: ImmutableStringReader;

  constructor(context: CommandContextBuilder<S>, reader: ImmutableStringReader, errors: Map<CommandNode<S>, CommandSyntaxError>) {
    this.context = context;
    this.reader = reader;
    this.errors = errors;
  }
}
