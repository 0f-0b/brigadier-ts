import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { StringReader } from "../StringReader.ts";
import { ArgumentType } from "./ArgumentType.ts";

export class IntegerArgumentType extends ArgumentType<number> {
  readonly minimum: number;
  readonly maximum: number;

  constructor(minimum = -0x80000000, maximum = 0x7fffffff) {
    super();
    this.minimum = minimum;
    this.maximum = maximum;
  }

  override parse(reader: StringReader): number {
    const start = reader.getCursor();
    const result = reader.readInt();
    if (result < this.minimum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.integerTooLow.createWithContext(
        reader,
        result,
        this.minimum,
      );
    }
    if (result > this.maximum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.integerTooHigh.createWithContext(
        reader,
        result,
        this.maximum,
      );
    }
    return result;
  }

  override getExamples(): Iterable<string> {
    return ["0", "123", "-123"];
  }
}

export function integer(
  min = -0x80000000,
  max = 0x7fffffff,
): IntegerArgumentType {
  return new IntegerArgumentType(min, max);
}
