import type { LiteralArgumentBuilder } from "../builder/LiteralArgumentBuilder.ts";
import { literal } from "../builder/LiteralArgumentBuilder.ts";
import type { Command } from "../Command.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import { StringRange } from "../context/StringRange.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { Predicate } from "../Predicate.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import { StringReader } from "../StringReader.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
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
      node.literals.set(this.getName(), this);
    }
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
