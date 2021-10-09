import type { ArgumentType } from "../arguments/ArgumentType.ts";
import { ArgumentCommandNode } from "../CommandNode.ts";
import type { SuggestionProvider } from "../suggestion/SuggestionProvider.ts";
import { ArgumentBuilder } from "./ArgumentBuilder.ts";

export class RequiredArgumentBuilder<S, T> extends ArgumentBuilder<S> {
  readonly #name: string;
  readonly #type: ArgumentType<T>;
  #suggestionsProvider?: SuggestionProvider<S>;

  constructor(name: string, type: ArgumentType<T>) {
    super();
    this.#name = name;
    this.#type = type;
  }

  suggests(
    provider: SuggestionProvider<S> | undefined,
  ): RequiredArgumentBuilder<S, T> {
    this.#suggestionsProvider = provider;
    return this;
  }

  override build(): ArgumentCommandNode<S, T> {
    const result = new ArgumentCommandNode(
      this.#name,
      this.#type,
      this.getCommand(),
      this.getRequirement(),
      this.getRedirect(),
      this.getRedirectModifier(),
      this.isFork(),
      this.#suggestionsProvider,
    );
    for (const argument of this.getArguments()) {
      result.addChild(argument);
    }
    return result;
  }
}

export function argument<S, T>(
  name: string,
  type: ArgumentType<T>,
): RequiredArgumentBuilder<S, T> {
  return new RequiredArgumentBuilder(name, type);
}
