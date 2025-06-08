export type Effect = () => void;
export type Dispose = () => void;

let activeObserver: {
  effect: Effect;
  link?: (unsubscribe: (effect: Effect) => void) => void;
} | null = null;

export class Signal<T = unknown> extends EventTarget {
  #unsubscribe(cb: Effect) {
    this.removeEventListener("change", cb);
  }

  #value: T;
  get value() {
    if (activeObserver) {
      this.addEventListener("change", activeObserver.effect);
      activeObserver.link?.(this.#unsubscribe.bind(this));
    }

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
  constructor(fn: () => T) {
    activeObserver = {
      effect: () => {
        this.value = fn();
      },
    };
    super(fn());
    activeObserver = null;
  }
}

export const signal = <T = unknown>(value: T) => new Signal(value);
export const computed = <T = unknown>(fn: () => T) => new Computed(fn);
export const effect = (cb: Effect): Dispose => {
  const unsubscribers: ((_cb: Effect) => void)[] = [];

  activeObserver = {
    effect: cb,
    link: (unsubscribe: (_cb: Effect) => void) => {
      unsubscribers.push(unsubscribe);
    },
  };
  cb();
  activeObserver = null;

  return () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe(cb);
    }
  };
};
