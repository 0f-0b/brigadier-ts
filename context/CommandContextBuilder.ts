import type { Command } from "../Command.ts";
import type { CommandDispatcher } from "../CommandDispatcher.ts";
import type { CommandNode } from "../CommandNode.ts";
import { CommandContext } from "../context/CommandContext.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import { setAll } from "../util.ts";
import { ParsedArgument } from "./ParsedArgument.ts";
import { ParsedCommandNode } from "./ParsedCommandNode.ts";
import { StringRange } from "./StringRange.ts";
import { SuggestionContext } from "./SuggestionContext.ts";

export class CommandContextBuilder<S> {
  readonly #arguments = new Map<string, ParsedArgument<unknown>>();
  readonly #rootNode: CommandNode<S>;
  readonly #nodes: ParsedCommandNode<S>[] = [];
  readonly #dispatcher: CommandDispatcher<S>;
  #source: S;
  #command?: Command<S>;
  #child?: CommandContextBuilder<S>;
  #range: StringRange;
  #modifier?: RedirectModifier<S>;
  #forks = false;

  constructor(
    dispatcher: CommandDispatcher<S>,
    source: S,
    rootNode: CommandNode<S>,
    start: number,
  ) {
    this.#rootNode = rootNode;
    this.#dispatcher = dispatcher;
    this.#source = source;
    this.#range = StringRange.at(start);
  }

  withSource(source: S): CommandContextBuilder<S> {
    this.#source = source;
    return this;
  }

  getSource(): S {
    return this.#source;
  }

  getRootNode(): CommandNode<S> {
    return this.#rootNode;
  }

  withArgument(
    name: string,
    argument: ParsedArgument<unknown>,
  ): CommandContextBuilder<S> {
    this.#arguments.set(name, argument);
    return this;
  }

  getArguments(): Map<string, ParsedArgument<unknown>> {
    return this.#arguments;
  }

  withCommand(command: Command<S> | undefined): CommandContextBuilder<S> {
    this.#command = command;
    return this;
  }

  withNode(node: CommandNode<S>, range: StringRange): CommandContextBuilder<S> {
    this.#nodes.push(new ParsedCommandNode<S>(node, range));
    this.#range = StringRange.encompassing(this.#range, range);
    this.#modifier = node.getRedirectModifier();
    this.#forks = node.isFork();
    return this;
  }

  copy(): CommandContextBuilder<S> {
    const copy = new CommandContextBuilder<S>(
      this.#dispatcher,
      this.#source,
      this.#rootNode,
      this.#range.start,
    );
    copy.#command = this.#command;
    setAll(copy.#arguments, this.#arguments);
    copy.#nodes.push(...this.#nodes);
    copy.#child = this.#child;
    copy.#range = this.#range;
    copy.#forks = this.#forks;
    return copy;
  }

  withChild(child: CommandContextBuilder<S>): CommandContextBuilder<S> {
    this.#child = child;
    return this;
  }

  getChild(): CommandContextBuilder<S> | undefined {
    return this.#child;
  }

  getLastChild(): CommandContextBuilder<S> {
    // deno-lint-ignore no-this-alias
    let result: CommandContextBuilder<S> = this;
    let child: CommandContextBuilder<S> | undefined;
    while ((child = result.getChild())) {
      result = child;
    }
    return result;
  }

  getCommand(): Command<S> | undefined {
    return this.#command;
  }

  getNodes(): ParsedCommandNode<S>[] {
    return this.#nodes;
  }

  build(input: string): CommandContext<S> {
    return new CommandContext(
      this.#source,
      input,
      this.#arguments,
      this.#command,
      this.#rootNode,
      this.#nodes,
      this.#range,
      this.#child?.build(input),
      this.#modifier,
      this.#forks,
    );
  }

  getDispatcher(): CommandDispatcher<S> {
    return this.#dispatcher;
  }

  getRange(): StringRange {
    return this.#range;
  }

  findSuggestionContext(cursor: number): SuggestionContext<S> {
    if (this.#range.start <= cursor) {
      if (this.#range.end < cursor) {
        if (this.#child) {
          return this.#child.findSuggestionContext(cursor);
        }
        const leaf = this.#nodes.at(-1);
        return leaf
          ? new SuggestionContext(leaf.node, leaf.range.end + 1)
          : new SuggestionContext(this.#rootNode, this.#range.start);
      } else {
        let prev = this.#rootNode;
        for (const node of this.#nodes) {
          const nodeRange = node.range;
          if (nodeRange.start <= cursor && cursor <= nodeRange.end) {
            return new SuggestionContext(prev, nodeRange.start);
          }
          prev = node.node;
        }
        if (prev) {
          return new SuggestionContext(prev, this.#range.start);
        }
      }
    }
    throw new TypeError("Can't find node before cursor");
  }
}