import "./LiteralCommandNode.ts";
import "./RootCommandNode.ts";
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

  override getName(): string {
    return this.#name;
  }

  override getUsageText(): string {
    return `<${this.#name}>`;
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
    return this.#customSuggestions?.(context, builder) ??
      this.#type.listSuggestions(context, builder);
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

  override getSortedKey(): string {
    return this.#name;
  }

  override getExamples(): Iterable<string> {
    return this.#type.getExamples();
  }
}