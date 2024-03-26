import { joinToString } from "@std/collections/join_to_string";
import { minWith } from "@std/collections/min_with";

import type { AmbiguityConsumer } from "./AmbiguityConsumer.ts";
import {
  type ArgumentSeparator,
  defaultArgumentSeparator,
} from "./ArgumentSeparator.ts";
import { CommandUsageFormatter } from "./CommandUsageFormatter.ts";
import { ParseResults } from "./ParseResults.ts";
import type { ResultConsumer } from "./ResultConsumer.ts";
import { StringReader } from "./StringReader.ts";
import type { LiteralArgumentBuilder } from "./builder/LiteralArgumentBuilder.ts";
import { CommandContextBuilder } from "./context/CommandContextBuilder.ts";
import { ContextChain } from "./context/ContextChain.ts";
import { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import { Suggestions } from "./suggestion/Suggestions.ts";
import { SuggestionsBuilder } from "./suggestion/SuggestionsBuilder.ts";
import type { CommandNode } from "./tree/CommandNode.ts";
import type { LiteralCommandNode } from "./tree/LiteralCommandNode.ts";
import { RootCommandNode } from "./tree/RootCommandNode.ts";

export class CommandDispatcher<S> {
  readonly #root: RootCommandNode<S>;
  #argumentSeparator: ArgumentSeparator = defaultArgumentSeparator;
  #consumer: ResultConsumer<S> = () => {};

  constructor(root: RootCommandNode<S> = new RootCommandNode<S>()) {
    this.#root = root;
  }

  register(command: LiteralArgumentBuilder<S>): LiteralCommandNode<S> {
    return this.#root.addChild(command.build());
  }

  setConsumer(consumer: ResultConsumer<S>): undefined {
    this.#consumer = consumer;
  }

  setArgumentSeparator(argumentSeparator: ArgumentSeparator): undefined {
    this.#argumentSeparator = argumentSeparator;
  }

  execute(input: string | StringReader, source: S): Promise<number>;
  execute(parse: ParseResults<S>): Promise<number>;
  async execute(
    parse: ParseResults<S> | StringReader | string,
    source?: S,
  ): Promise<number> {
    if (!(parse instanceof ParseResults)) {
      parse = this.parse(parse, source!);
    }
    if (parse.reader.canRead()) {
      if (parse.errors.size === 1) {
        throw parse.errors.values().next().value;
      }
      throw (parse.context.getRange().isEmpty()
        ? CommandSyntaxError.builtInErrors.dispatcherUnknownCommand
        : CommandSyntaxError.builtInErrors.dispatcherUnknownArgument)
        .createWithContext(parse.reader);
    }
    const command = parse.reader.getString();
    const original = parse.context.build(command);
    const flatContext = ContextChain.tryFlatten(original);
    if (!flatContext) {
      this.#consumer(original, false, 0);
      throw CommandSyntaxError.builtInErrors.dispatcherUnknownCommand
        .createWithContext(parse.reader);
    }
    return await flatContext.executeAll(original.getSource(), this.#consumer);
  }

  parse(reader: string | StringReader, source: S): ParseResults<S> {
    if (typeof reader === "string") {
      reader = new StringReader(reader);
    }
    const context = new CommandContextBuilder(
      this,
      source,
      this.#root,
      reader.getCursor(),
    );
    return this.#parseNodes(this.#root, reader, context);
  }

  #parseNodes(
    node: CommandNode<S>,
    originalReader: StringReader,
    contextSoFar: CommandContextBuilder<S>,
  ): ParseResults<S> {
    const potentials: ParseResults<S>[] = [];
    const errors = new Map<CommandNode<S>, CommandSyntaxError>();
    for (
      const child of node.getRelevantNodes(
        originalReader,
        this.#argumentSeparator,
      )
    ) {
      const parse = this.#parseChildNode(child, originalReader, contextSoFar);
      if (parse.success) {
        if (parse.results !== null) {
          potentials.push(parse.results);
        }
      } else {
        errors.set(child, parse.error);
      }
    }
    if (potentials.length !== 0) {
      return minWith(
        potentials,
        (a, b) =>
          (Number(a.reader.canRead()) - Number(b.reader.canRead())) ||
          (Number(a.errors.size !== 0) - Number(b.errors.size !== 0)),
      )!;
    }
    return new ParseResults(contextSoFar, originalReader, errors);
  }

  #parseChildNode(
    child: CommandNode<S>,
    originalReader: StringReader,
    contextSoFar: CommandContextBuilder<S>,
  ):
    | { success: true; results: ParseResults<S> | null }
    | { success: false; error: CommandSyntaxError } {
    const source = contextSoFar.getSource();
    if (!child.canUse(source)) {
      return { success: true, results: null };
    }
    const context = contextSoFar.copy();
    const reader = new StringReader(originalReader);
    const cursor = reader.getCursor();
    let skippedSeparator = -1;
    try {
      try {
        child.parse(reader, context, this.#argumentSeparator);
      } catch (e: unknown) {
        if (e instanceof CommandSyntaxError) {
          throw e;
        }
        throw CommandSyntaxError.builtInErrors.dispatcherParseError
          .createWithContext(reader, String(e));
      }
      if (reader.canRead()) {
        skippedSeparator = reader.getCursor();
        if (!this.#argumentSeparator(reader)) {
          throw CommandSyntaxError.builtInErrors
            .dispatcherExpectedArgumentSeparator.createWithContext(reader);
        }
      }
    } catch (e: unknown) {
      if (!(e instanceof CommandSyntaxError)) {
        throw e;
      }
      reader.setCursor(cursor);
      return { success: false, error: e };
    }
    context.withCommand(child.getCommand());
    if (skippedSeparator !== -1) {
      const redirect = child.getRedirect();
      if (redirect) {
        const childContext = new CommandContextBuilder(
          this,
          source,
          redirect,
          reader.getCursor(),
        );
        if (reader.canRead()) {
          const parse = this.#parseNodes(redirect, reader, childContext);
          context.withChild(parse.context);
          return {
            success: true,
            results: new ParseResults(context, parse.reader, parse.errors),
          };
        }
        context.withChild(childContext);
      } else {
        if (reader.canRead()) {
          return {
            success: true,
            results: this.#parseNodes(child, reader, context),
          };
        }
      }
      reader.setCursor(skippedSeparator);
    }
    return {
      success: true,
      results: new ParseResults(context, reader, new Map()),
    };
  }

  getAllUsage(
    node: CommandNode<S>,
    source: S,
    restricted: boolean,
    formatter: CommandUsageFormatter = new CommandUsageFormatter(),
  ): string[] {
    const result: string[] = [];
    this.#getAllUsage(node, source, result, "", restricted, formatter);
    return result;
  }

  #getAllUsage(
    node: CommandNode<S>,
    source: S,
    result: string[],
    prefix: string,
    restricted: boolean,
    formatter: CommandUsageFormatter,
  ): undefined {
    if (restricted && !node.canUse(source)) {
      return;
    }
    if (node.getCommand()) {
      result.push(prefix);
    }
    const separator = formatter.argumentSeparator();
    const redirect = node.getRedirect();
    if (redirect) {
      result.push(
        (prefix || node.getUsageText(formatter)) + separator +
          (redirect === this.#root
            ? formatter.redirectToRoot()
            : formatter.redirectTo(redirect.getUsageText(formatter))),
      );
      return;
    }
    for (const child of node.getChildren()) {
      this.#getAllUsage(
        child,
        source,
        result,
        (prefix ? prefix + separator : "") + child.getUsageText(formatter),
        restricted,
        formatter,
      );
    }
  }

  getSmartUsage(
    node: CommandNode<S>,
    source: S,
    formatter: CommandUsageFormatter = new CommandUsageFormatter(),
  ): Map<CommandNode<S>, string> {
    const result = new Map<CommandNode<S>, string>();
    const optional = node.getCommand() !== undefined;
    for (const child of node.getChildren()) {
      const usage = this.#getSmartUsage(
        child,
        source,
        optional,
        false,
        formatter,
      );
      if (usage !== undefined) {
        result.set(child, usage);
      }
    }
    return result;
  }

  #getSmartUsage(
    node: CommandNode<S>,
    source: S,
    optional: boolean,
    deep: boolean,
    formatter: CommandUsageFormatter,
  ): string | undefined {
    if (!node.canUse(source)) {
      return undefined;
    }
    const self = optional
      ? formatter.optional(node.getUsageText(formatter))
      : node.getUsageText(formatter);
    const childOptional = node.getCommand() !== undefined;
    if (!deep) {
      const separator = formatter.argumentSeparator();
      const redirect = node.getRedirect();
      if (redirect) {
        return self + separator +
          (redirect === this.#root
            ? formatter.redirectToRoot()
            : formatter.redirectTo(redirect.getUsageText(formatter)));
      }
      const children = Array.from(node.getChildren())
        .filter((c) => c.canUse(source));
      if (children.length !== 0) {
        if (children.length === 1) {
          const usage = this.#getSmartUsage(
            children[0],
            source,
            childOptional,
            childOptional,
            formatter,
          );
          if (usage !== undefined) {
            return self + separator + usage;
          }
        } else {
          const childUsage = new Set<string>();
          for (const child of children) {
            const usage = this.#getSmartUsage(
              child,
              source,
              childOptional,
              true,
              formatter,
            );
            if (usage !== undefined) {
              childUsage.add(usage);
            }
          }
          if (childUsage.size !== 0) {
            if (childUsage.size === 1) {
              const usage = childUsage.values().next().value;
              return self + separator +
                (childOptional ? formatter.optional(usage) : usage);
            }
            const usage = joinToString(
              children,
              (child) => child.getUsageText(formatter),
              { separator: formatter.or() },
            );
            return self + separator +
              (childOptional
                ? formatter.optional(usage)
                : formatter.required(usage));
          }
        }
      }
    }
    return self;
  }

  async getCompletionSuggestions(
    parse: ParseResults<S>,
    cursor: number = parse.reader.getTotalLength(),
  ): Promise<Suggestions> {
    const context = parse.context;
    const nodeBeforeCursor = context.findSuggestionContext(cursor);
    const parent = nodeBeforeCursor.parent;
    const start = Math.min(nodeBeforeCursor.startPos, cursor);
    const fullInput = parse.reader.getString();
    const truncatedInput = fullInput.substring(0, cursor);
    const truncatedInputLowerCase = truncatedInput.toLowerCase();
    const promises = Array.from(parent.getChildren(), (node) => {
      try {
        return node.listSuggestions(
          context.build(truncatedInput),
          new SuggestionsBuilder(
            truncatedInput,
            truncatedInputLowerCase,
            start,
          ),
        );
      } catch (e: unknown) {
        if (!(e instanceof CommandSyntaxError)) {
          throw e;
        }
        return Suggestions.empty();
      }
    });
    const suggestions = await Promise.all(promises);
    return Suggestions.merge(fullInput, suggestions);
  }

  getRoot(): RootCommandNode<S> {
    return this.#root;
  }

  getPath(target: CommandNode<S>): string[] {
    const nodes: CommandNode<S>[][] = [];
    this.#addPaths(this.#root, nodes, []);
    for (const list of nodes) {
      if (list.at(-1) === target) {
        const result: string[] = [];
        for (const node of list) {
          if (node !== this.#root) {
            result.push(node.getName());
          }
        }
        return result;
      }
    }
    return [];
  }

  findNode(path: Iterable<string>): CommandNode<S> | undefined {
    let node: CommandNode<S> | undefined = this.#root;
    for (const name of path) {
      node = node.getChild(name);
      if (node === undefined) {
        return undefined;
      }
    }
    return node;
  }

  findAmbiguities(consumer: AmbiguityConsumer<S>): undefined {
    this.#root.findAmbiguities(consumer, this.#argumentSeparator);
  }

  #addPaths(
    node: CommandNode<S>,
    result: CommandNode<S>[][],
    parents: CommandNode<S>[],
  ): undefined {
    const current = [...parents, node];
    result.push(current);
    for (const child of node.getChildren()) {
      this.#addPaths(child, result, current);
    }
  }
}
