import type { Reference } from "@esfx/ref";

import type { Command } from "../Command.ts";
import type { Predicate } from "../Predicate.ts";
import type { RedirectModifier } from "../RedirectModifier.ts";
import type { SingleRedirectModifier } from "../SingleRedirectModifier.ts";
import type { CommandNode } from "../tree/CommandNode.ts";
import { RootCommandNode } from "../tree/RootCommandNode.ts";

export abstract class ArgumentBuilder<S> {
  readonly #arguments = new RootCommandNode<S>();
  #command: Command<S> | undefined;
  #requirement: Predicate<S> = () => true;
  #target: CommandNode<S> | undefined;
  #modifier: RedirectModifier<S> | undefined;
  #forks = false;

  constructor() {
    this.#arguments = new RootCommandNode();
  }

  then(argument: ArgumentBuilder<S> | CommandNode<S>): this {
    if (this.#target) {
      throw new TypeError("Cannot add children to a redirected node");
    }
    if (argument instanceof ArgumentBuilder) {
      argument = argument.build();
    }
    this.#arguments.addChild(argument);
    return this;
  }

  getArguments(): Iterable<CommandNode<S>> {
    return this.#arguments.getChildren();
  }

  executes(command: Command<S>): this {
    this.#command = command;
    return this;
  }

  getCommand(): Command<S> | undefined {
    return this.#command;
  }

  requires(requirement: Predicate<S>): this {
    this.#requirement = requirement;
    return this;
  }

  getRequirement(): Predicate<S> {
    return this.#requirement;
  }

  redirect(target: CommandNode<S>, modifier?: SingleRedirectModifier<S>): this {
    return this.forward(
      target,
      modifier && (async (c) => [await modifier(c)]),
      false,
    );
  }

  fork(target: CommandNode<S>, modifier: RedirectModifier<S>): this {
    return this.forward(target, modifier, true);
  }

  forward(
    target: CommandNode<S> | undefined,
    modifier: RedirectModifier<S> | undefined,
    forks: boolean,
  ): this {
    if (this.#arguments.children.size !== 0) {
      throw new TypeError("Cannot forward a node with children");
    }
    this.#target = target;
    this.#modifier = modifier;
    this.#forks = forks;
    return this;
  }

  getRedirect(): CommandNode<S> | undefined {
    return this.#target;
  }

  getRedirectModifier(): RedirectModifier<S> | undefined {
    return this.#modifier;
  }

  isFork(): boolean {
    return this.#forks;
  }

  abstract build(): CommandNode<S>;

  addTo(node: CommandNode<S>, ref: Reference<CommandNode<S>>): this {
    ref.value = node.addChild(this.build());
    return this;
  }
}
