import type { Message } from "./Message.ts";

export class LiteralMessage implements Message {
  readonly #str: string;

  constructor(str: string) {
    this.#str = str;
  }

  getString(): string {
    return this.#str;
  }
}
