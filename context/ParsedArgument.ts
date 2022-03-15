import {
  combineHashes,
  defaultEqualer,
  Equatable,
} from "../deps/@esfx/equatable.ts";
import { StringRange } from "./StringRange.ts";

export class ParsedArgument<T> implements Equatable {
  readonly range: StringRange;
  readonly result: T;

  constructor(start: number, end: number, result: T) {
    this.range = StringRange.between(start, end);
    this.result = result;
  }

  [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof ParsedArgument &&
      this.range[Equatable.equals](other.range) &&
      defaultEqualer.equals(this.result, other.result));
  }

  [Equatable.hash](): number {
    return combineHashes(
      this.range[Equatable.hash](),
      defaultEqualer.hash(this.result),
    );
  }
}
