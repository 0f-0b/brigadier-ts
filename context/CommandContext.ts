import type { Command } from "../Command.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import type { CommandNode } from "../tree/CommandNode.ts";
import type { ParsedArgument } from "./ParsedArgument.ts";
import type { ParsedCommandNode } from "./ParsedCommandNode.ts";
import type { StringRange } from "./StringRange.ts";

export class CommandContext<S> {
  readonly #source: S;
  readonly #input: string;
  readonly #command?: Command<S>;
  readonly #arguments: Map<string, ParsedArgument<unknown>>;
  readonly #rootNode: CommandNode<S>;
  readonly #nodes: readonly ParsedCommandNode<S>[];
  readonly #range: StringRange;
  readonly #child?: CommandContext<S>;
  readonly #modifier?: RedirectModifier<S>;
  readonly #forks: boolean;

  constructor(
    source: S,
    input: string,
    parsedArguments: Map<string, ParsedArgument<unknown>>,
    command: Command<S> | undefined,
    rootNode: CommandNode<S>,
    nodes: readonly ParsedCommandNode<S>[],
    range: StringRange,
    child: CommandContext<S> | undefined,
    modifier: RedirectModifier<S> | undefined,
    forks: boolean,
  ) {
    this.#source = source;
    this.#input = input;
    this.#arguments = parsedArguments;
    this.#command = command;
    this.#rootNode = rootNode;
    this.#nodes = nodes;
    this.#range = range;
    this.#child = child;
    this.#modifier = modifier;
    this.#forks = forks;
  }

  copyFor(source: S): CommandContext<S> {
    if (this.#source === source) {
      return this;
    }
    return new CommandContext<S>(
      source,
      this.#input,
      this.#arguments,
      this.#command,
      this.#rootNode,
      this.#nodes,
      this.#range,
      this.#child,
      this.#modifier,
      this.#forks,
    );
  }

  getChild(): CommandContext<S> | undefined {
    return this.#child;
  }

  getLastChild(): CommandContext<S> {
    // deno-lint-ignore no-this-alias
    let result: CommandContext<S> = this;
    let child: CommandContext<S> | undefined;
    while ((child = result.getChild())) {
      result = child;
    }
    return result;
  }

  getCommand(): Command<S> | undefined {
    return this.#command;
  }

  getSource(): S {
    return this.#source;
  }

  getArgument<T>(name: string): T {
    const argument = this.#arguments.get(name);
    if (!argument) {
      throw new TypeError(`No such argument '${name}' exists on this command`);
    }
    return argument.result as T;
  }

  getRedirectModifier(): RedirectModifier<S> | undefined {
    return this.#modifier;
  }

  getRange(): StringRange {
    return this.#range;
  }

  getInput(): string {
    return this.#input;
  }

  getRootNode(): CommandNode<S> {
    return this.#rootNode;
  }

  getNodes(): readonly ParsedCommandNode<S>[] {
    return this.#nodes;
  }

  hasNodes(): boolean {
    return this.#nodes.length !== 0;
  }

  isForked(): boolean {
    return this.#forks;
  }
}
