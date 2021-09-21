import { CommandSyntaxError } from "./errors/CommandSyntaxError.ts";
import type { ImmutableStringReader } from "./ImmutableStringReader.ts";

const allowedNumber = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "-"]);
const quotedStringStart = new Set(["\"", "'"]);
const allowedInUnquotedString = new Set([
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "-", ".", "+",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
]);

export class StringReader implements ImmutableStringReader {
  readonly #string: string;
  #cursor: number;

  constructor(str: string | StringReader) {
    if (typeof str === "string") {
      this.#string = str;
      this.#cursor = 0;
    } else {
      this.#string = str.#string;
      this.#cursor = str.#cursor;
    }
  }

  getString(): string {
    return this.#string;
  }

  setCursor(cursor: number): void {
    this.#cursor = cursor;
  }

  getRemainingLength(): number {
    return this.#string.length - this.#cursor;
  }

  getTotalLength(): number {
    return this.#string.length;
  }

  getCursor(): number {
    return this.#cursor;
  }

  getRead(): string {
    return this.#string.substring(0, this.#cursor);
  }

  getRemaining(): string {
    return this.#string.substring(this.#cursor);
  }

  canRead(length = 1): boolean {
    return this.#cursor + length <= this.#string.length;
  }

  peek(offset = 0): string {
    return this.#string.charAt(this.#cursor + offset);
  }

  read(): string {
    return this.#string.charAt(this.#cursor++);
  }

  skip(): void {
    this.#cursor++;
  }

  static isAllowedNumber(c: string): boolean {
    return allowedNumber.has(c);
  }

  static isQuotedStringStart(c: string): boolean {
    return quotedStringStart.has(c);
  }

  skipWhitespace(): void {
    this.#cursor = this.getTotalLength() - this.getRemaining().trimStart().length;
  }

  readInt(): number {
    const start = this.#cursor;
    while (this.canRead() && StringReader.isAllowedNumber(this.peek()))
      this.skip();
    const number = this.#string.substring(start, this.#cursor);
    if (number.length === 0)
      throw CommandSyntaxError.builtInErrors.readerExpectedInt.createWithContext(this);
    const result = Number(number);
    if (!Number.isInteger(result)) {
      this.#cursor = start;
      throw CommandSyntaxError.builtInErrors.readerInvalidInt.createWithContext(this, number);
    }
    return result;
  }

  readFloat(): number {
    const start = this.#cursor;
    while (this.canRead() && StringReader.isAllowedNumber(this.peek()))
      this.skip();
    const number = this.#string.substring(start, this.#cursor);
    if (number.length === 0)
      throw CommandSyntaxError.builtInErrors.readerExpectedFloat.createWithContext(this);
    const result = Number(number);
    if (Number.isNaN(result)) {
      this.#cursor = start;
      throw CommandSyntaxError.builtInErrors.readerInvalidFloat.createWithContext(this, number);
    }
    return result;
  }

  static isAllowedInUnquotedString(c: string): boolean {
    return allowedInUnquotedString.has(c);
  }

  readUnquotedString(): string {
    const start = this.#cursor;
    while (this.canRead() && StringReader.isAllowedInUnquotedString(this.peek()))
      this.skip();
    return this.#string.substring(start, this.#cursor);
  }

  readQuotedString(): string {
    if (!this.canRead())
      return "";
    const next = this.peek();
    if (!StringReader.isQuotedStringStart(next))
      throw CommandSyntaxError.builtInErrors.readerExpectedStartOfQuote.createWithContext(this);
    this.skip();
    return this.readStringUntil(next);
  }

  readStringUntil(terminator: string): string {
    const result: string[] = [];
    let escaped = false;
    while (this.canRead()) {
      const c = this.read();
      if (escaped) {
        if (c === terminator || c === "\\") {
          result.push(c);
          escaped = false;
        } else {
          this.#cursor--;
          throw CommandSyntaxError.builtInErrors.readerInvalidEscape.createWithContext(this, c);
        }
      } else switch (c) {
        case "\\":
          escaped = true;
          break;
        case terminator:
          return result.join("");
        default:
          result.push(c);
          break;
      }
    }
    throw CommandSyntaxError.builtInErrors.readerExpectedEndOfQuote.createWithContext(this);
  }

  readString(): string {
    if (!this.canRead())
      return "";
    const next = this.peek();
    if (StringReader.isQuotedStringStart(next)) {
      this.skip();
      return this.readStringUntil(next);
    }
    return this.readUnquotedString();
  }

  readBoolean(): boolean {
    const start = this.#cursor;
    const value = this.readString();
    switch (value) {
      case "":
        throw CommandSyntaxError.builtInErrors.readerExpectedBool.createWithContext(this);
      case "true":
        return true;
      case "false":
        return false;
      default:
        this.#cursor = start;
        throw CommandSyntaxError.builtInErrors.readerInvalidBool.createWithContext(this, value);
    }
  }

  expect(c: string): void {
    if (this.canRead() && this.peek() === c) {
      this.skip();
      return;
    }
    throw CommandSyntaxError.builtInErrors.readerExpectedSymbol.createWithContext(this, c);
  }
}
