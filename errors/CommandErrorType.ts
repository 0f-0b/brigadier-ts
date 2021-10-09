import type { ImmutableStringReader } from "../ImmutableStringReader.ts";
import type { Message } from "../Message.ts";
import { CommandSyntaxError } from "./CommandSyntaxError.ts";

export class CommandErrorType<Args extends unknown[]> {
  readonly #func: (...args: Args) => Message;

  constructor(func: (...args: Args) => Message) {
    this.#func = func;
  }

  create(...args: Args): CommandSyntaxError {
    return new CommandSyntaxError(this, this.#func(...args));
  }

  createWithContext(
    reader: ImmutableStringReader,
    ...args: Args
  ): CommandSyntaxError {
    return new CommandSyntaxError(
      this,
      this.#func(...args),
      reader.getString(),
      reader.getCursor(),
    );
  }
}
