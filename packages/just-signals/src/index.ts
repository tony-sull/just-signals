export type Effect = () => void;
export type Dispose = () => void;

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

export class Computed<T = unknown> extends Signal<T> {
  constructor(fn: () => T, deps: Signal[]) {
    super(fn());

    for (const dep of deps) {
      dep.addEventListener("change", () => (this.value = fn()));
    }
  }
}

export const signal = <T = unknown>(value: T) => new Signal(value);
export const computed = <T = unknown>(fn: () => T, deps: Signal[]) =>
  new Computed(fn, deps);
export const effect = (cb: Effect, deps: Signal[]): Dispose => {
  cb();

  for (const dep of deps) {
    dep.addEventListener("change", cb);
  }

  return () => {
    for (const dep of deps) {
      dep.removeEventListener("change", cb);
    }
  };
};
