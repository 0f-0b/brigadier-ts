import { LiteralCommandNode } from "../CommandNode.ts";
import { ArgumentBuilder } from "./ArgumentBuilder.ts";

export class LiteralArgumentBuilder<S> extends ArgumentBuilder<S> {
  readonly literal: string;

  constructor(literal: string) {
    super();
    this.literal = literal;
  }

  build(): LiteralCommandNode<S> {
    const result = new LiteralCommandNode<S>(
      this.literal,
      this.getCommand(),
      this.getRequirement(),
      this.getRedirect(),
      this.getRedirectModifier(),
      this.isFork(),
    );
    for (const argument of this.getArguments()) {
      result.addChild(argument);
    }
    return result;
  }
}

export function literal<S>(name: string): LiteralArgumentBuilder<S> {
  return new LiteralArgumentBuilder(name);
}
