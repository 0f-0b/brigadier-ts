import {
  combineHashes,
  defaultEqualer,
  Equaler,
  rawHash,
} from "./deps/esfx/equatable.ts";

type UnknownMap = ReadonlyMap<unknown, unknown>;

function assertIsMap(value: unknown): asserts value is UnknownMap {
  Map.prototype.has.call(value, 0);
}

export const mapEqualer = Equaler.create<UnknownMap>(
  (a, b) => {
    assertIsMap(a);
    assertIsMap(b);
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
    assertIsMap(x);
    let hash = 0;
    for (const [key, value] of x) {
      const keyHash = rawHash(key);
      const valueHash = defaultEqualer.hash(value);
      hash = (hash + combineHashes(keyHash, valueHash)) | 0;
    }
    return hash;
  },
);
