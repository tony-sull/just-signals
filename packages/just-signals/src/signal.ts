export class Signal<T = unknown> extends EventTarget {
  #value: T;
  get value() {
    return this.#value;
  }
  set value(value: T) {
    if (this.#value === value) return;
    this.#value = value;
    this.dispatchEvent(new CustomEvent("change"));
  }

  constructor(value: T) {
    super();
    this.#value = value;
  }

  valueOf() {
    return this.#value;
  }
  toString() {
    return String(this.#value);
  }
}

export function signal<T = unknown>(value: T) {
  return new Signal(value);
}
