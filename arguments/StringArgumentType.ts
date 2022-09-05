import { Equatable, rawHash } from "../deps/esfx/equatable.ts";

import { StringReader } from "../StringReader.ts";
import { never } from "../util.ts";
import { ArgumentType } from "./ArgumentType.ts";

export const singleWord = Symbol("singleWord");
export const quotablePhrase = Symbol("quotablePhrase");
export const greedyPhrase = Symbol("greedyPhrase");
export type StringType =
  | typeof singleWord
  | typeof quotablePhrase
  | typeof greedyPhrase;

export class StringArgumentType extends ArgumentType<string> {
  readonly type: StringType;

  constructor(type: StringType) {
    super();
    this.type = type;
  }

  override parse(reader: StringReader): string {
    switch (this.type) {
      case singleWord:
        return reader.readUnquotedString();
      case quotablePhrase:
        return reader.readString();
      case greedyPhrase: {
        const text = reader.getRemaining();
        reader.setCursor(reader.getTotalLength());
        return text;
      }
      default:
        never(this.type);
    }
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof StringArgumentType &&
      this.type === other.type);
  }

  override [Equatable.hash](): number {
    return rawHash(this.type);
  }

  override toString(): string {
    switch (this.type) {
      case singleWord:
        return "word()";
      case quotablePhrase:
        return "string()";
      case greedyPhrase:
        return "greedyString()";
      default:
        never(this.type);
    }
  }

  override getExamples(): Iterable<string> {
    switch (this.type) {
      case singleWord:
        return ["word", "words_with_underscores"];
      case quotablePhrase:
        return ['"quoted phrase"', "word", '""'];
      case greedyPhrase:
        return ["word", "words with spaces", '"and symbols"'];
      default:
        never(this.type);
    }
  }
}

export function word(): StringArgumentType {
  return new StringArgumentType(singleWord);
}

export function string(): StringArgumentType {
  return new StringArgumentType(quotablePhrase);
}

export function greedyString(): StringArgumentType {
  return new StringArgumentType(greedyPhrase);
}

export function escapeIfRequired(input: string): string {
  for (const c of input) {
    if (!StringReader.isAllowedInUnquotedString(c)) {
      return `"${input.replace(/[\\"]/g, "\\$&")}"`;
    }
  }
  return input;
}
