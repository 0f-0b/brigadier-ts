import { Equatable } from "../deps/@esfx/equatable.ts";
import type { StringReader } from "../StringReader.ts";
import type { CommandContext } from "../context/CommandContext.ts";
import type { CommandContextBuilder } from "../context/CommandContextBuilder.ts";
import { Suggestions } from "../suggestion/Suggestions.ts";
import type { SuggestionsBuilder } from "../suggestion/SuggestionsBuilder.ts";
import { CommandNode } from "./CommandNode.ts";

export class RootCommandNode<S> extends CommandNode<S> {
  constructor() {
    super(undefined, () => true, undefined, (s) => [s.getSource()], false);
  }

  override _addTo(): void {
    throw new TypeError(
      "Cannot add a RootCommandNode as a child to any other CommandNode",
    );
  }

  override getName(): string {
    return "";
  }

  override getUsageText(): string {
    return "";
  }

  override parse(
    _reader: StringReader,
    _context: CommandContextBuilder<S>,
  ): void {}

  override listSuggestions(
    _context: CommandContext<S>,
    _builder: SuggestionsBuilder,
  ): Promise<Suggestions> {
    return Suggestions.empty();
  }

  override isValidInput(): boolean {
    return false;
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof RootCommandNode &&
      super[Equatable.equals](other));
  }

  override createBuilder(): never {
    throw new TypeError("Cannot convert root into a builder");
  }

  override getSortedKey(): string {
    return "";
  }

  override _sortOrder(): number {
    return 0;
  }

  override getExamples(): Iterable<string> {
    return [];
  }

  override toString(): string {
    return "<root>";
  }
}
