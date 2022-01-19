export type Predicate<T> = (t: T) => boolean;

export function and<T>(...preds: readonly Predicate<T>[]): Predicate<T> {
  return (t) => preds.every((pred) => pred(t));
}

export function or<T>(...preds: readonly Predicate<T>[]): Predicate<T> {
  return (t) => preds.some((pred) => pred(t));
}

export function not<T>(pred: Predicate<T>): Predicate<T> {
  return (t) => !pred(t);
}
