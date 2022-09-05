import { combineHashes, Equatable, rawHash } from "../deps/esfx/equatable.ts";

import { defaultArgumentSeparator } from "../ArgumentSeparator.ts";
import {
  literal,
  type LiteralArgumentBuilder,
} from "../builder/LiteralArgumentBuilder.ts";
import type { Command } from "../Command.ts";
import type { CommandUsageFormatter } from "../CommandUsageFormatter.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import { StringRange } from "../context/StringRange.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { Predicate } from "../Predicate.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import { StringReader } from "../StringReader.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { CommandNode } from "./CommandNode.ts";

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

  override _addTo(node: CommandNode<S>): undefined {
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
      node.literals.set(this.getName(), this);
    }
    return;
  }

  override getName(): string {
    return this.#literal;
  }

  override parse(
    reader: StringReader,
    contextBuilder: CommandContextBuilder<S>,
    argumentSeparator = defaultArgumentSeparator,
  ): undefined {
    const start = reader.getCursor();
    const end = this.#parse(reader, argumentSeparator);
    if (end === undefined) {
      throw CommandSyntaxError.builtInErrors.literalIncorrect
        .createWithContext(reader, this.#literal);
    }
    contextBuilder.withNode(this, StringRange.between(start, end));
    return;
  }

  #parse(
    reader: StringReader,
    argumentSeparator = defaultArgumentSeparator,
  ): number | undefined {
    const length = this.#literal.length;
    const start = reader.getCursor();
    if (reader.canRead(length)) {
      const end = start + length;
      if (reader.getString().substring(start, end) === this.#literal) {
        reader.setCursor(end);
        if (reader.canRead()) {
          if (!argumentSeparator(reader)) {
            reader.setCursor(start);
            return undefined;
          }
          reader.setCursor(end);
        }
        return end;
      }
    }
    return undefined;
  }

  override listSuggestions(
    _context: CommandContext<S>,
    builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    return this.#literalLowerCase.startsWith(builder.remainingLowerCase)
      ? builder.suggest(this.#literal).buildPromise()
      : Suggestions.empty();
  }

  override isValidInput(
    input: string,
    argumentSeparator = defaultArgumentSeparator,
  ): boolean {
    return this.#parse(new StringReader(input), argumentSeparator) !==
      undefined;
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof LiteralCommandNode &&
      super[Equatable.equals](other) && this.#literal === other.#literal);
  }

  override [Equatable.hash](): number {
    return combineHashes(super[Equatable.hash](), rawHash(this.#literal));
  }

  override getUsageText(_formatter?: CommandUsageFormatter): string {
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

  override _sortOrder(): number {
    return -1;
  }

  override getExamples(): Iterable<string> {
    return [this.#literal];
  }

  override toString(): string {
    return `<literal ${this.#literal}>`;
  }
}
