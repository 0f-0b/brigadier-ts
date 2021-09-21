import type { StringReader } from "../StringReader.ts";
import { never } from "../util.ts";
import { ArgumentType } from "./ArgumentType.ts";

export type StringType =
  | "single_word"
  | "quotable_phrase"
  | "greedy_phrase";

export class StringArgumentType extends ArgumentType<string> {
  readonly type: StringType;

  constructor(type: StringType) {
    super();
    this.type = type;
  }

  override parse(reader: StringReader): string {
    switch (this.type) {
      case "single_word":
        return reader.readUnquotedString();
      case "quotable_phrase":
        return reader.readString();
      case "greedy_phrase": {
        const text = reader.getRemaining();
        reader.setCursor(reader.getTotalLength());
        return text;
      }
      default:
        never(this.type);
    }
  }

  override getExamples(): Iterable<string> {
    switch (this.type) {
      case "single_word":
        return ["word", "words_with_underscores"];
      case "quotable_phrase":
        return ["\"quoted phrase\"", "word", "\"\""];
      case "greedy_phrase":
        return ["word", "words with spaces", "\"and symbols\""];
      default:
        never(this.type);
    }
  }
}

export function word(): StringArgumentType {
  return new StringArgumentType("single_word");
}

export function string(): StringArgumentType {
  return new StringArgumentType("quotable_phrase");
}

export function greedyString(): StringArgumentType {
  return new StringArgumentType("greedy_phrase");
}
