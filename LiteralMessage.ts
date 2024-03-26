import { Equatable, rawHash } from "@esfx/equatable";

import type { Message } from "./Message.ts";

export class LiteralMessage implements Message, Equatable {
  readonly #str: string;

  constructor(str: string) {
    this.#str = str;
  }

  getString(): string {
    return this.#str;
  }

  [Equatable.equals](other: unknown): boolean {
    return this === other || (other instanceof LiteralMessage &&
      this.#str === other.#str);
  }

  [Equatable.hash](): number {
    return rawHash(this.#str);
  }

  toString(): string {
    return this.#str;
  }
}
