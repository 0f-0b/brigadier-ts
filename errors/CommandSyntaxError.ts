import { LiteralMessage } from "../LiteralMessage.ts";
import type { Message } from "../Message.ts";
import { CommandErrorType } from "./CommandErrorType.ts";

export class CommandSyntaxError extends Error {
  static enableCommandStackTraces = true;
  static builtInErrors: {
    readonly floatTooLow: CommandErrorType<[number, number]>;
    readonly floatTooHigh: CommandErrorType<[number, number]>;
    readonly integerTooLow: CommandErrorType<[number, number]>;
    readonly integerTooHigh: CommandErrorType<[number, number]>;
    readonly literalIncorrect: CommandErrorType<[string]>;
    readonly readerExpectedStartOfQuote: CommandErrorType<[]>;
    readonly readerExpectedEndOfQuote: CommandErrorType<[]>;
    readonly readerInvalidEscape: CommandErrorType<[string]>;
    readonly readerInvalidBool: CommandErrorType<[string]>;
    readonly readerInvalidInt: CommandErrorType<[string]>;
    readonly readerExpectedInt: CommandErrorType<[]>;
    readonly readerInvalidFloat: CommandErrorType<[string]>;
    readonly readerExpectedFloat: CommandErrorType<[]>;
    readonly readerExpectedBool: CommandErrorType<[]>;
    readonly readerExpectedSymbol: CommandErrorType<[string]>;
    readonly dispatcherUnknownCommand: CommandErrorType<[]>;
    readonly dispatcherUnknownArgument: CommandErrorType<[]>;
    readonly dispatcherExpectedArgumentSeparator: CommandErrorType<[]>;
    readonly dispatcherParseError: CommandErrorType<[string]>;
  } = Object.freeze({
    floatTooLow: new CommandErrorType((found: number, min: number) =>
      new LiteralMessage(`Float must not be less than ${min}, found ${found}`)
    ),
    floatTooHigh: new CommandErrorType((found: number, max: number) =>
      new LiteralMessage(`Float must not be more than ${max}, found ${found}`)
    ),
    integerTooLow: new CommandErrorType((found: number, min: number) =>
      new LiteralMessage(`Integer must not be less than ${min}, found ${found}`)
    ),
    integerTooHigh: new CommandErrorType((found: number, max: number) =>
      new LiteralMessage(`Integer must not be more than ${max}, found ${found}`)
    ),
    literalIncorrect: new CommandErrorType((expected: string) =>
      new LiteralMessage(`Expected literal ${expected}`)
    ),
    readerExpectedStartOfQuote: new CommandErrorType(() =>
      new LiteralMessage("Expected quote to start a string")
    ),
    readerExpectedEndOfQuote: new CommandErrorType(() =>
      new LiteralMessage("Unclosed quoted string")
    ),
    readerInvalidEscape: new CommandErrorType((character: string) =>
      new LiteralMessage(
        `Invalid escape sequence '${character}' in quoted string`,
      )
    ),
    readerInvalidBool: new CommandErrorType((value: string) =>
      new LiteralMessage(
        `Invalid bool, expected true or false but found '${value}'`,
      )
    ),
    readerInvalidInt: new CommandErrorType((value: string) =>
      new LiteralMessage(`Invalid integer '${value}'`)
    ),
    readerExpectedInt: new CommandErrorType(() =>
      new LiteralMessage("Expected integer")
    ),
    readerInvalidFloat: new CommandErrorType((value: string) =>
      new LiteralMessage(`Invalid float '${value}'`)
    ),
    readerExpectedFloat: new CommandErrorType(() =>
      new LiteralMessage("Expected float")
    ),
    readerExpectedBool: new CommandErrorType(() =>
      new LiteralMessage("Expected bool")
    ),
    readerExpectedSymbol: new CommandErrorType((symbol: string) =>
      new LiteralMessage(`Expected '${symbol}'`)
    ),
    dispatcherUnknownCommand: new CommandErrorType(() =>
      new LiteralMessage("Unknown command")
    ),
    dispatcherUnknownArgument: new CommandErrorType(() =>
      new LiteralMessage("Incorrect argument for command")
    ),
    dispatcherExpectedArgumentSeparator: new CommandErrorType(() =>
      new LiteralMessage(
        "Expected whitespace to end one argument, but found trailing data",
      )
    ),
    dispatcherParseError: new CommandErrorType((message: string) =>
      new LiteralMessage(`Could not parse command: ${message}`)
    ),
  });
  // deno-lint-ignore no-explicit-any
  readonly type: CommandErrorType<any>;
  readonly rawMessage: Message;
  readonly input: string | undefined;
  readonly cursor: number | undefined;

  constructor(
    // deno-lint-ignore no-explicit-any
    type: CommandErrorType<any>,
    message: Message,
    input?: string,
    cursor?: number,
  ) {
    super(message.getString());
    this.name = "CommandSyntaxError";
    this.type = type;
    this.rawMessage = message;
    this.input = input;
    this.cursor = cursor;
    if (!CommandSyntaxError.enableCommandStackTraces) {
      this.stack = undefined!;
    }
  }

  override get message(): string {
    return this.getMessage();
  }

  getMessage(
    contextBuilder: (
      message: string,
      cursor: number,
      context: string,
    ) => string = (message, cursor, context) =>
      `${message} at position ${cursor}: ${context}`,
    amount?: number,
    marker?: string,
    truncated?: string,
  ): string {
    const message = this.rawMessage.getString();
    const context = this.getContext(amount, marker, truncated);
    return context === undefined
      ? message
      : contextBuilder(message, this.cursor!, context);
  }

  get context(): string | undefined {
    return this.getContext();
  }

  getContext(
    amount = 10,
    marker = "<--[HERE]",
    truncated = "...",
  ): string | undefined {
    if (this.input === undefined || this.cursor === undefined) {
      return undefined;
    }
    let builder = "";
    const fixedCursor = Math.min(this.input.length, this.cursor);
    if (fixedCursor > amount) {
      builder += truncated;
    }
    builder += this.input.substring(
      Math.max(0, fixedCursor - amount),
      fixedCursor,
    );
    builder += marker;
    return builder;
  }
}

export type BuiltInErrors = typeof CommandSyntaxError.builtInErrors;
