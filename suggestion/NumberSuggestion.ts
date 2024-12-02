import { combineHashes, rawHash } from "@esfx/equatable";

import type { StringRange } from "../context/StringRange.ts";
import type { Message } from "../Message.ts";
import { Suggestion } from "./Suggestion.ts";

export class NumberSuggestion extends Suggestion {
  readonly value: number;

  constructor(range: StringRange, value: number, tooltip?: Message) {
    super(range, value.toString(), tooltip);
    this.value = value;
  }

  override _equals(other: this): boolean {
    return super._equals(other) && this.value === other.value;
  }

  override _hash(): number {
    return combineHashes(super._hash(), rawHash(this.value));
  }

  override _sortOrder(): number {
    return -1;
  }

  override _sortKey(): unknown {
    return this.value;
  }

  override _sortKeyIC(): unknown {
    return this.value;
  }
}
