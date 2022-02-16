export * from "https://esm.sh/@esfx/equatable@1.0.0-pre.19?pin=v66";
export * from "https://esm.sh/@esfx/ref@1.0.0-pre.23?pin=v66";

import {
  combineHashes,
  defaultEqualer,
  Equaler,
  rawHash,
} from "https://esm.sh/@esfx/equatable@1.0.0-pre.19?pin=v66";

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

export function combineHashesV(...hashes: number[]): number {
  let h = 0;
  for (const hash of hashes) {
    h = combineHashes(h, hash);
  }
  return h;
}
