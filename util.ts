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

export interface JoinToStringOptions {
  separator?: string;
  prefix?: string;
  suffix?: string;
  truncate?: {
    after: number;
    with?: string;
  };
}

export function joinToString<T>(
  it: Iterable<T>,
  selector: (value: T) => string,
  {
    separator = ", ",
    prefix = "",
    suffix = "",
    truncate: {
      after: limit,
      with: truncated = "...",
    } = { after: Infinity },
  }: JoinToStringOptions = {},
): string {
  let result = prefix;
  let count = 0;
  for (const elem of it) {
    if (++count > 1) {
      result += separator;
    }
    if (count > limit) {
      result += truncated;
      break;
    }
    result += selector(elem);
  }
  result += suffix;
  return result;
}

export function addAll<T>(set: Set<T>, it: Iterable<T>): Set<T> {
  for (const elem of it) {
    set.add(elem);
  }
  return set;
}

export function setAll<K, V>(map: Map<K, V>, it: Iterable<[K, V]>): Map<K, V> {
  for (const [key, value] of it) {
    map.set(key, value);
  }
  return map;
}
