import { CommandSyntaxError } from "../errors/CommandSyntaxError.ts";
import type { StringReader } from "../StringReader.ts";
import { ArgumentType } from "./ArgumentType.ts";

export class FloatArgumentType extends ArgumentType<number> {
  readonly minimum: number;
  readonly maximum: number;

  constructor(minimum = -Number.MAX_VALUE, maximum = Number.MAX_VALUE) {
    super();
    this.minimum = minimum;
    this.maximum = maximum;
  }

  override parse(reader: StringReader): number {
    const start = reader.getCursor();
    const result = reader.readFloat();
    if (result < this.minimum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.floatTooLow.createWithContext(
        reader,
        result,
        this.minimum,
      );
    }
    if (result > this.maximum) {
      reader.setCursor(start);
      throw CommandSyntaxError.builtInErrors.floatTooHigh.createWithContext(
        reader,
        result,
        this.maximum,
      );
    }
    return result;
  }

  override getExamples(): Iterable<string> {
    return ["0", "1.2", ".5", "-1", "-.5", "-1234.56"];
  }
}

export function float(
  min = -Number.MAX_VALUE,
  max = Number.MAX_VALUE,
): FloatArgumentType {
  return new FloatArgumentType(min, max);
}
