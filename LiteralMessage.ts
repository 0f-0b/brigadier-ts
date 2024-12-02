import { Equatable, rawHash } from "@esfx/equatable";

import type { Message } from "./Message.ts";
import { mixinEquatable } from "./mixin_equatable.ts";

export class LiteralMessage implements Message, Equatable {
  readonly #str: string;

  constructor(str: string) {
    this.#str = str;
  }

  getString(): string {
    return this.#str;
  }

  _equals(other: this): boolean {
    return this.#str === other.#str;
  }

  _hash(): number {
    return rawHash(this.#str);
  }

  toString(): string {
    return this.#str;
  }

  declare [Equatable.equals]: (other: unknown) => boolean;
  declare [Equatable.hash]: () => number;

  static {
    mixinEquatable(this.prototype);
  }
}
