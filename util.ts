import {
  combineHashes,
  defaultEqualer,
  Equaler,
  rawHash,
} from "./deps/@esfx/equatable.ts";

export type Awaitable<T> = T | PromiseLike<T>;

export function never(value: never): never {
  throw new TypeError(`Got ${value}; this should never happen`);
}

export function minOf<T>(
  it: Iterable<T>,
  selector: (value: T) => number,
): number {
  let result = Infinity;
  for (const elem of it) {
    const value = selector(elem);
    if (Number.isNaN(value)) {
      return value;
    }
    if (value < result) {
      result = value;
    }
  }
  return result;
}

export function maxOf<T>(
  it: Iterable<T>,
  selector: (value: T) => number,
): number {
  let result = -Infinity;
  for (const elem of it) {
    const value = selector(elem);
    if (Number.isNaN(value)) {
      return value;
    }
    if (value > result) {
      result = value;
    }
  }
  return result;
}

export const mapEqualer = Equaler.create<ReadonlyMap<unknown, unknown>>(
  (a, b) => {
    Map.prototype.has.call(a, 0);
    Map.prototype.has.call(b, 0);
    if (a === b) {
      return true;
    }
    if (a.size !== b.size) {
      return false;
    }
    for (const [key, value] of a) {
      if (!(b.has(key) && defaultEqualer.equals(value, b.get(key)!))) {
        return false;
      }
    }
    return true;
  },
  (x) => {
    Map.prototype.has.call(x, 0);
    let h = 0;
    for (const [key, value] of x) {
      h += combineHashes(rawHash(key), defaultEqualer.hash(value));
    }
    return h;
  },
);
