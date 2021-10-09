import type { AmbiguityConsumer } from "./AmbiguityConsumer.ts";
import type { ArgumentType } from "./arguments/ArgumentType.ts";
import type { ArgumentBuilder } from "./builder/ArgumentBuilder.ts";
import type { LiteralArgumentBuilder } from "./builder/LiteralArgumentBuilder.ts";
import { literal } from "./builder/LiteralArgumentBuilder.ts";
import type { RequiredArgumentBuilder } from "./builder/RequiredArgumentBuilder.ts";
import { argument } from "./builder/RequiredArgumentBuilder.ts";
import type { Command } from "./Command.ts";
import type { CommandContext } from "./context/CommandContext.ts";
import type { CommandContextBuilder } from "./context/CommandContextBuilder.ts";
import { ParsedArgument } from "./context/ParsedArgument.ts";
import { StringRange } from "./context/StringRange.ts";
import { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import type { Predicate } from "./Predicate.ts";
import type { RedirectModifier } from "./RedirectModifier.ts";
import { StringReader } from "./StringReader.ts";
import type { SuggestionProvider } from "./suggestion/SuggestionProvider.ts";
import type { SuggestionsBuilder } from "./suggestion/SuggestionsBuilder.ts";
import { Suggestions } from "./suggestion/Suggestions.ts";

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

  addChild(node: CommandNode<S>): void {
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
      while (input.canRead() && input.peek() != " ") {
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

export class RootCommandNode<S> extends CommandNode<S> {
  constructor() {
    super(undefined, () => true, undefined, (s) => [s.getSource()], false);
  }

  override getName(): string {
    return "";
  }

  override getUsageText(): string {
    return "";
  }

  override parse(): void {}

  override listSuggestions(): Promise<Suggestions> {
    return Suggestions.empty();
  }

  override isValidInput(): boolean {
    return false;
  }

  override createBuilder(): never {
    throw new TypeError("Cannot convert root into a builder");
  }

  override getSortedKey(): string {
    return "";
  }

  getExamples(): Iterable<string> {
    return [];
  }
}

export class LiteralCommandNode<S> extends CommandNode<S> {
  readonly #literal: string;
  readonly #literalLowerCase: string;

  constructor(
    literal: string,
    command: Command<S> | undefined,
    requirement: Predicate<S>,
    redirect: CommandNode<S> | undefined,
    modifier: RedirectModifier<S> | undefined,
    forks: boolean,
  ) {
    super(command, requirement, redirect, modifier, forks);
    this.#literal = literal;
    this.#literalLowerCase = literal.toLowerCase();
  }

  getLiteral(): string {
    return this.#literal;
  }

  override getName(): string {
    return this.#literal;
  }

  override parse(
    reader: StringReader,
    contextBuilder: CommandContextBuilder<S>,
  ): void {
    const start = reader.getCursor();
    const end = this.#parse(reader);
    if (end === undefined) {
      throw CommandSyntaxError.builtInErrors.literalIncorrect.createWithContext(
        reader,
        this.#literal,
      );
    }
    contextBuilder.withNode(this, StringRange.between(start, end));
  }

  #parse(reader: StringReader): number | undefined {
    const length = this.#literal.length;
    const start = reader.getCursor();
    if (reader.canRead(length)) {
      const end = start + length;
      if (reader.getString().substring(start, end) === this.#literal) {
        reader.setCursor(end);
        if (!reader.canRead() || reader.peek() === " ") {
          return end;
        }
        reader.setCursor(start);
      }
    }
    return undefined;
  }

  override listSuggestions(
    _context: CommandContext<S>,
    builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    if (this.#literalLowerCase.startsWith(builder.remainingLowerCase)) {
      return builder.suggest(this.#literal).buildPromise();
    }
    return Suggestions.empty();
  }

  override isValidInput(input: string): boolean {
    return this.#parse(new StringReader(input)) !== undefined;
  }

  override getUsageText(): string {
    return this.#literal;
  }

  override createBuilder(): LiteralArgumentBuilder<S> {
    const builder = literal<S>(this.#literal);
    builder.requires(this.getRequirement());
    builder.forward(
      this.getRedirect(),
      this.getRedirectModifier(),
      this.isFork(),
    );
    const command = this.getCommand();
    if (command) {
      builder.executes(command);
    }
    return builder;
  }

  override getSortedKey(): string {
    return this.#literal;
  }

  override getExamples(): Iterable<string> {
    return [this.#literal];
  }
}

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
      return !reader.canRead() || reader.peek() == " ";
    } catch (_) {
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
