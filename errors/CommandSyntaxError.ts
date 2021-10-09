import type { Message } from "../Message.ts";
import { LiteralMessage } from "../LiteralMessage.ts";
import { CommandErrorType } from "./CommandErrorType.ts";

export const contextAmount = 10;

export class CommandSyntaxError extends Error {
  static enableCommandStackTraces = true;
  static builtInErrors = Object.freeze({
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
  readonly input?: string;
  readonly cursor?: number;

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
    if (CommandSyntaxError.enableCommandStackTraces) {
      Error.captureStackTrace?.(this, CommandSyntaxError);
    } else {
      this.stack = undefined;
    }
  }

  get message(): string {
    return this.getMessage();
  }

  getMessage(
    contextBuilder = (message: string, cursor: number, context: string) =>
      `${message} at position ${cursor}: ${context}`,
    amount?: number,
    marker?: string,
  ): string {
    const message = this.rawMessage.getString();
    const context = this.getContext(amount, marker);
    return context === undefined
      ? message
      : contextBuilder(message, this.cursor!, context);
  }

  get context(): string | undefined {
    return this.getContext();
  }

  getContext(amount = 10, marker = "<--[HERE]"): string | undefined {
    if (this.input === undefined || this.cursor === undefined) {
      return undefined;
    }
    let builder = "";
    const fixedCursor = Math.min(this.input.length, this.cursor);
    if (fixedCursor > amount) {
      builder += "...";
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
