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
    if (this.range.start == 0 && this.range.end === input.length)
      return this.text;
    const result: string[] = [];
    if (this.range.start > 0)
      result.push(input.substring(0, this.range.start));
    result.push(this.text);
    if (this.range.end < input.length)
      result.push(input.substring(this.range.end));
    return result.join("");
  }

  expand(command: string, range: StringRange): Suggestion {
    if (range.start === this.range.start && range.end === this.range.end)
      return this;
    const result: string[] = [];
    if (range.start < this.range.start)
      result.push(command.substring(range.start, this.range.start));
    result.push(this.text);
    if (range.end > this.range.end)
      result.push(command.substring(this.range.end, range.end));
    return new Suggestion(range, result.join(""), this.tooltip);
  }
}
