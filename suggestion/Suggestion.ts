import type { StringRange } from "../context/StringRange.ts";
import type { Message } from "../Message.ts";

export class Suggestion {
  readonly range: StringRange;
  readonly text: string;
  readonly tooltip?: Message;

  constructor(range: StringRange, text: string, tooltip?: Message) {
    this.range = range;
    this.text = text;
    this.tooltip = tooltip;
  }

  apply(input: string): string {
    if (this.range.start == 0 && this.range.end === input.length) {
      return this.text;
    }
    let result = "";
    if (this.range.start > 0) {
      result += input.substring(0, this.range.start);
    }
    result += this.text;
    if (this.range.end < input.length) {
      result += input.substring(this.range.end);
    }
    return result;
  }

  expand(command: string, range: StringRange): Suggestion {
    if (range.start === this.range.start && range.end === this.range.end) {
      return this;
    }
    let result = "";
    if (range.start < this.range.start) {
      result += command.substring(range.start, this.range.start);
    }
    result += this.text;
    if (range.end > this.range.end) {
      result += command.substring(this.range.end, range.end);
    }
    return new Suggestion(range, result, this.tooltip);
  }
}
