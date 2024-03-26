import { combineHashes, Equatable, rawHash } from "@esfx/equatable";

import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { StringReader } from "../StringReader.ts";
import { ArgumentType } from "./ArgumentType.ts";

export class IntegerArgumentType extends ArgumentType<number> {
  readonly minimum: number;
  readonly maximum: number;

  constructor(
    minimum = -Number.MAX_SAFE_INTEGER,
    maximum = Number.MAX_SAFE_INTEGER,
  ) {
    super();
    this.minimum = minimum;
    this.maximum = maximum;
  }

  override parse(reader: StringReader): number {
    const start = reader.getCursor();
    const result = reader.readInt();
    if (result < this.minimum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.integerTooLow
        .createWithContext(reader, result, this.minimum);
    }
    if (result > this.maximum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.integerTooHigh
        .createWithContext(reader, result, this.maximum);
    }
    return result;
  }

  override [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof IntegerArgumentType &&
      this.minimum === other.minimum && this.maximum === other.maximum);
  }

  override [Equatable.hash](): number {
    return combineHashes(rawHash(this.minimum), rawHash(this.maximum));
  }

  override toString(): string {
    if (this.maximum < Number.MAX_SAFE_INTEGER) {
      return `integer(${this.minimum}, ${this.maximum})`;
    }
    if (this.minimum > -Number.MAX_SAFE_INTEGER) {
      return `integer(${this.minimum})`;
    }
    return "integer()";
  }

  override getExamples(): Iterable<string> {
    return ["0", "123", "-123"];
  }
}

export function integer(min?: number, max?: number): IntegerArgumentType {
  return new IntegerArgumentType(min, max);
}
