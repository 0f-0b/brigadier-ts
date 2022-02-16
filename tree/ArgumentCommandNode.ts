import { combineHashesV, Equatable, rawHash } from "../deps.ts";
import type { ArgumentType } from "../arguments/ArgumentType.ts";
import type { RequiredArgumentBuilder } from "../builder/RequiredArgumentBuilder.ts";
import { argument } from "../builder/RequiredArgumentBuilder.ts";
import type { Command } from "../Command.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import { ParsedArgument } from "../context/ParsedArgument.ts";
import type { Predicate } from "../Predicate.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import { StringReader } from "../StringReader.ts";
import type { SuggestionProvider } from "../suggestion/SuggestionProvider.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import { CommandNode } from "./CommandNode.ts";

export class ArgumentCommandNode<S, T> extends CommandNode<S> {
  readonly #name: string;
  readonly #type: ArgumentType<T>;
  readonly #customSuggestions?: SuggestionProvider<S>;

  constructor(
    name: string,
    type: ArgumentType<T>,
    command: Command<S> | undefined,
    requirement: Predicate<S>,
    redirect: CommandNode<S> | undefined,
    modifier: RedirectModifier<S> | undefined,
    forks: boolean,
    customSuggestions: SuggestionProvider<S> | undefined,
  ) {
    super(command, requirement, redirect, modifier, forks);
    this.#name = name;
    this.#type = type;
    this.#customSuggestions = customSuggestions;
  }

  getType(): ArgumentType<T> {
    return this.#type;
  }

  override _addTo(node: CommandNode<S>): void {
    const child = node.children.get(this.getName());
    if (child) {
      if (this.getCommand()) {
        child.command = this.getCommand();
      }
      for (const grandchild of this.getChildren()) {
        child.addChild(grandchild);
      }
    } else {
      node.children.set(this.getName(), this);
      node.arguments.set(this.getName(), this);
    }
  }

  override getName(): string {
    return this.#name;
  }

  override getUsageText(): string {
    return `<${this.#name}>`;
  }

  getCustomSuggestions(): SuggestionProvider<S> | undefined {
    return this.#customSuggestions;
  }

  override parse(
    reader: StringReader,
    contextBuilder: CommandContextBuilder<S>,
  ): void {
    const start = reader.getCursor();
    const result = this.#type.parse(reader);
    const parsed = new ParsedArgument<T>(start, reader.getCursor(), result);
    contextBuilder.withArgument(this.#name, parsed);
    contextBuilder.withNode(this, parsed.range);
  }

  override listSuggestions(
    context: CommandContext<S>,
    builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    return this.#customSuggestions
      ? this.#customSuggestions(context, builder)
      : this.#type.listSuggestions(context, builder);
  }

  override createBuilder(): RequiredArgumentBuilder<S, T> {
    const builder = argument<S, T>(this.#name, this.#type);
    builder.requires(this.getRequirement());
    builder.forward(
      this.getRedirect(),
      this.getRedirectModifier(),
      this.isFork(),
    );
    builder.suggests(this.#customSuggestions);
    const command = this.getCommand();
    if (command) {
      builder.executes(command);
    }
    return builder;
  }

  override isValidInput(input: string): boolean {
    try {
      const reader = new StringReader(input);
      this.#type.parse(reader);
      return !reader.canRead() || reader.peek() === " ";
    } catch {
      return false;
    }
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof ArgumentCommandNode &&
      super[Equatable.equals](other) &&
      this.#name === other.#name &&
      this.#type[Equatable.equals](other.#type));
  }

  override [Equatable.hash](): number {
    return combineHashesV(
      super[Equatable.hash](),
      rawHash(this.#name),
      this.#type[Equatable.hash](),
    );
  }

  override getSortedKey(): string {
    return this.#name;
  }

  override _sortOrder(): number {
    return 0;
  }

  override getExamples(): Iterable<string> {
    return this.#type.getExamples();
  }

  override toString(): string {
    return `<argument ${this.#name}:${this.#type}>`;
  }
}
