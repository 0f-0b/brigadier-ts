import { Equatable } from "@esfx/equatable";

import { isObject } from "./is_object.ts";

export interface EquatableInternals {
  _equals(other: this): boolean;
  _hash(): number;
}

class Template implements Equatable, EquatableInternals {
  declare _equals: (other: this) => boolean;
  declare _hash: () => number;

  [Equatable.equals](other: unknown): boolean {
    return this === other ||
      (isObject(this) && isObject(other) &&
        this.constructor === other.constructor &&
        !!this._equals(other as this));
  }

  [Equatable.hash](): number {
    return this._hash() | 0;
  }
}

const descriptors = {
  [Equatable.equals]: Object.getOwnPropertyDescriptor(
    Template.prototype,
    Equatable.equals,
  )!,
  [Equatable.hash]: Object.getOwnPropertyDescriptor(
    Template.prototype,
    Equatable.hash,
  )!,
};

export function mixinEquatable(o: EquatableInternals): undefined {
  Object.defineProperties(o, descriptors);
}
