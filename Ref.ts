export interface ReadonlyRef<T> {
  deref(): T;
}

export interface OutRef<T> {
  set(value: T): void;
}

export class Ref<T> implements ReadonlyRef<T>, OutRef<T> {
  #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  deref(): T {
    return this.#value;
  }

  set(value: T): void {
    this.#value = value;
  }
}
