import type { AmbiguityConsumer } from "../AmbiguityConsumer.ts";
import type { ArgumentBuilder } from "../builder/ArgumentBuilder.ts";
import type { Command } from "../Command.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import type { Predicate } from "../Predicate.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import { StringReader } from "../StringReader.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import { ArgumentCommandNode } from "./ArgumentCommandNode.ts";
import { LiteralCommandNode } from "./LiteralCommandNode.ts";
import { RootCommandNode } from "./RootCommandNode.ts";

export abstract class CommandNode<S> {
  readonly children: Map<string, CommandNode<S>> = new Map();
  readonly literals: Map<string, LiteralCommandNode<S>> = new Map();
  readonly arguments: Map<string, ArgumentCommandNode<S, unknown>> = new Map();
  readonly #requirement: Predicate<S>;
  readonly #redirect?: CommandNode<S>;
  readonly #modifier?: RedirectModifier<S>;
  readonly #forks: boolean;
  command?: Command<S>;

  constructor(
    command: Command<S> | undefined,
    requirement: Predicate<S>,
    redirect: CommandNode<S> | undefined,
    modifier: RedirectModifier<S> | undefined,
    forks: boolean,
  ) {
    this.command = command;
    this.#requirement = requirement;
    this.#redirect = redirect;
    this.#modifier = modifier;
    this.#forks = forks;
  }

  getCommand(): Command<S> | undefined {
    return this.command;
  }

  getChildren(): Iterable<CommandNode<S>> {
    return this.children.values();
  }

  getChild(name: string): CommandNode<S> | undefined {
    return this.children.get(name);
  }

  getRedirect(): CommandNode<S> | undefined {
    return this.#redirect;
  }

  getRedirectModifier(): RedirectModifier<S> | undefined {
    return this.#modifier;
  }

  canUse(source: S): boolean {
    return this.#requirement(source);
  }

  addChild<T extends CommandNode<S>>(node: T): T {
    if (node instanceof RootCommandNode) {
      throw new TypeError(
        "Cannot add a RootCommandNode as a child to any other CommandNode",
      );
    }
    const child = this.children.get(node.getName());
    if (child) {
      if (node.getCommand()) {
        child.command = node.getCommand();
      }
      for (const grandchild of node.getChildren()) {
        child.addChild(grandchild);
      }
    } else {
      this.children.set(node.getName(), node);
      if (node instanceof LiteralCommandNode) {
        this.literals.set(node.getName(), node);
      } else if (node instanceof ArgumentCommandNode) {
        this.arguments.set(node.getName(), node);
      }
    }
    return node;
  }

  findAmbiguities(consumer: AmbiguityConsumer<S>): void {
    let matches = new Set<string>();
    for (const child of this.children.values()) {
      for (const sibling of this.children.values()) {
        if (child === sibling) {
          continue;
        }
        for (const input of child.getExamples()) {
          if (sibling.isValidInput(input)) {
            matches.add(input);
          }
        }
        if (matches.size) {
          consumer(this, child, sibling, matches);
          matches = new Set();
        }
      }
      child.findAmbiguities(consumer);
    }
  }

  abstract isValidInput(input: string): boolean;

  getRequirement(): Predicate<S> {
    return this.#requirement;
  }

  abstract getName(): string;

  abstract getUsageText(): string;

  abstract parse(reader: StringReader, context: CommandContextBuilder<S>): void;

  abstract listSuggestions(
    context: CommandContext<S>,
    builder: SuggestionsBuilder,
  ): Promise<Suggestions>;

  abstract createBuilder(): ArgumentBuilder<S>;

  abstract getSortedKey(): string;

  getRelevantNodes(input: StringReader): Iterable<CommandNode<S>> {
    if (this.literals.size > 0) {
      const cursor = input.getCursor();
      while (input.canRead() && input.peek() !== " ") {
        input.skip();
      }
      const text = input.getString().substring(cursor, input.getCursor());
      input.setCursor(cursor);
      const literal = this.literals.get(text);
      if (literal) {
        return [literal];
      }
    }
    return this.arguments.values();
  }

  isFork(): boolean {
    return this.#forks;
  }

  abstract getExamples(): Iterable<string>;
}
