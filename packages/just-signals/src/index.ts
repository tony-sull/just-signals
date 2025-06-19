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
  #listenerCount = 0;
  #updateFn: () => void;

  constructor(
    private fn: () => T,
    private deps: Signal[],
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super(null);
    this.#updateFn = this.updateFn.bind(this);
  }

  private updateFn() {
    this.value = this.fn();
  }

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    if (this.#listenerCount++ === 0) {
      this.updateFn();
      for (const dep of this.deps) {
        dep.addEventListener("change", this.#updateFn);
      }
    }

    super.addEventListener(type, callback, options);
  }

  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    if (--this.#listenerCount === 0) {
      for (const dep of this.deps) {
        dep.removeEventListener("change", this.#updateFn);
      }
    }

    super.removeEventListener(type, callback, options);
  }
}

export const signal = <T = unknown>(value: T) => new Signal(value);
export const computed = <T = unknown>(fn: () => T, deps: Signal[]) =>
  new Computed(fn, deps);
export const effect = (cb: Effect, deps: Signal[]): Dispose => {
  for (const dep of deps) {
    dep.addEventListener("change", cb);
  }

  cb();

  return () => {
    for (const dep of deps) {
      dep.removeEventListener("change", cb);
    }
  };
};
