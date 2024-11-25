import type { ResultConsumer } from "../ResultConsumer.ts";
import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { CommandContext } from "./CommandContext.ts";

export type Stage = "modify" | "execute";

export class ContextChain<S> {
  readonly #modifiers: readonly CommandContext<S>[];
  readonly #executable: CommandContext<S>;
  #nextStageCache: ContextChain<S> | undefined;

  constructor(
    modifiers: readonly CommandContext<S>[],
    executable: CommandContext<S>,
  ) {
    if (!executable.getCommand()) {
      throw new TypeError("Last command in chain must be executable");
    }
    this.#modifiers = modifiers;
    this.#executable = executable;
  }

  static tryFlatten<S>(
    rootContext: CommandContext<S>,
  ): ContextChain<S> | undefined {
    const modifiers: CommandContext<S>[] = [];
    let current = rootContext;
    for (;;) {
      const child = current.getChild();
      if (!child) {
        return current.getCommand()
          ? new ContextChain(modifiers, current)
          : undefined;
      }
      modifiers.push(current);
      current = child;
    }
  }

  static async runModifier<S>(
    modifier: CommandContext<S>,
    source: S,
    resultConsumer: ResultConsumer<S>,
    forkedMode: boolean,
  ): Promise<Iterable<S> | AsyncIterable<S>> {
    const sourceModifier = modifier.getRedirectModifier();
    if (!sourceModifier) {
      return [source];
    }
    const contextToUse = modifier.copyFor(source);
    try {
      return await sourceModifier(contextToUse);
    } catch (e) {
      if (e instanceof CommandSyntaxError) {
        resultConsumer(contextToUse, false, 0);
        if (forkedMode) {
          return [];
        }
      }
      throw e;
    }
  }

  static async runExecutable<S>(
    executable: CommandContext<S>,
    source: S,
    resultConsumer: ResultConsumer<S>,
    forkedMode: boolean,
  ): Promise<number> {
    const contextToUse = executable.copyFor(source);
    try {
      const result = await executable.getCommand()!(contextToUse);
      resultConsumer(contextToUse, true, result);
      return forkedMode ? 1 : result;
    } catch (e) {
      if (e instanceof CommandSyntaxError) {
        resultConsumer(contextToUse, false, 0);
        if (forkedMode) {
          return 0;
        }
      }
      throw e;
    }
  }

  async executeAll(
    source: S,
    resultConsumer: ResultConsumer<S>,
  ): Promise<number> {
    if (this.#modifiers.length === 0) {
      return await ContextChain.runExecutable(
        this.#executable,
        source,
        resultConsumer,
        false,
      );
    }
    let forkedMode = false;
    let currentSources = [source];
    for (const modifier of this.#modifiers) {
      forkedMode ||= modifier.isForked();
      const nextSources: S[] = [];
      for (const sourceToRun of currentSources) {
        const results = await ContextChain.runModifier(
          modifier,
          sourceToRun,
          resultConsumer,
          forkedMode,
        );
        for await (const source of results) {
          nextSources.push(source);
        }
      }
      if (nextSources.length === 0) {
        return 0;
      }
      currentSources = nextSources;
    }
    let result = 0;
    for (const executionSource of currentSources) {
      result += await ContextChain.runExecutable(
        this.#executable,
        executionSource,
        resultConsumer,
        forkedMode,
      );
    }
    return result;
  }

  getStage(): Stage {
    return this.#modifiers.length === 0 ? "execute" : "modify";
  }

  getTopContext(): CommandContext<S> {
    return this.#modifiers.length === 0 ? this.#executable : this.#modifiers[0];
  }

  nextStage(): ContextChain<S> | undefined {
    if (this.#modifiers.length === 0) {
      return undefined;
    }
    this.#nextStageCache ??= new ContextChain(
      this.#modifiers.slice(1),
      this.#executable,
    );
    return this.#nextStageCache;
  }
}
