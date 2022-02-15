import { Suggestions } from "../suggestion/Suggestions.ts";
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
