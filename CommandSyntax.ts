import type { StringReader } from "./StringReader.ts";
import type { ArgumentType } from "./arguments/ArgumentType.ts";

export class CommandSyntax {
  argument(name: string, _type: ArgumentType<unknown>): string {
    return `<${name}>`;
  }

  or(): string {
    return "|";
  }

  required(usage: string): string {
    return `(${usage})`;
  }

  optional(usage: string): string {
    return `[${usage}]`;
  }

  redirectTo(usage: string): string {
    return `-> ${usage}`;
  }

  redirectToRoot(): string {
    return "...";
  }

  argumentSeparator(): string {
    return " ";
  }

  skipArgumentSeparator(reader: StringReader): boolean {
    if (reader.peek() === " ") {
      reader.skip();
      return true;
    }
    return false;
  }
}
