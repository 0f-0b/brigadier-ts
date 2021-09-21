import { StringRange } from "./StringRange.ts";

export class ParsedArgument<T> {
  readonly range: StringRange;
  readonly result: T;

  constructor(start: number, end: number, result: T) {
    this.range = StringRange.between(start, end);
    this.result = result;
  }
}
