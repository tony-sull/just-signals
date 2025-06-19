import { Signal } from "./signal.js";
import type { ValueOf } from "./types.js";

export class Computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
  D4 extends Signal = Signal,
  D5 extends Signal = Signal,
  D6 extends Signal = Signal,
  D7 extends Signal = Signal,
> extends Signal<T> {
  #listenerCount = 0;
  #updateFn: () => void;

  constructor(
    fn: (d1: ValueOf<D1>) => T,
    deps: [D1, never, never, never, never, never, never],
  );
  constructor(
    fn: (d1: ValueOf<D1>, d2: ValueOf<D2>) => T,
    deps: [D1, D2, never, never, never, never, never],
  );
  constructor(
    fn: (d1: ValueOf<D1>, d2: ValueOf<D2>, d3: ValueOf<D3>) => T,
    deps: [D1, D2, D3, never, never, never, never],
  );
  constructor(
    fn: (
      d1: ValueOf<D1>,
      d2: ValueOf<D2>,
      d3: ValueOf<D3>,
      d4: ValueOf<D4>,
    ) => T,
    deps: [D1, D2, D3, D4, never, never, never],
  );
  constructor(
    fn: (
      d1: ValueOf<D1>,
      d2: ValueOf<D2>,
      d3: ValueOf<D3>,
      d4: ValueOf<D4>,
      d5: ValueOf<D5>,
    ) => T,
    deps: [D1, D2, D3, D4, D5, never, never],
  );
  constructor(
    fn: (
      d1: ValueOf<D1>,
      d2: ValueOf<D2>,
      d3: ValueOf<D3>,
      d4: ValueOf<D4>,
      d5: ValueOf<D5>,
      d6: ValueOf<D6>,
    ) => T,
    deps: [D1, D2, D3, D4, D5, D6, never],
  );
  constructor(
    fn: (
      d1: ValueOf<D1>,
      d2: ValueOf<D2>,
      d3: ValueOf<D3>,
      d4: ValueOf<D4>,
      d5: ValueOf<D5>,
      d6: ValueOf<D6>,
      d7: ValueOf<D7>,
    ) => T,
    deps: [D1, D2, D3, D4, D5, D6, D7],
  );
  constructor(
    private fn: (
      d1: ValueOf<D1>,
      d2: ValueOf<D2>,
      d3: ValueOf<D3>,
      d4: ValueOf<D4>,
      d5: ValueOf<D5>,
      d6: ValueOf<D6>,
      d7: ValueOf<D7>,
    ) => T,
    private deps: [D1, D2, D3, D4, D5, D6, D7],
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super(null);
    this.#updateFn = this.updateFn.bind(this);
  }

  private updateFn() {
    this.value = this.fn(
      ...(this.deps.map((d) => d.value) as Parameters<typeof this.fn>),
    );
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

export function computed<T = unknown, D1 extends Signal = Signal>(
  fn: (d1: ValueOf<D1>) => T,
  deps: [D1],
): Computed<T, D1>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
>(
  fn: (d1: ValueOf<D1>, d2: ValueOf<D2>) => T,
  deps: [D1, D2],
): Computed<T, D1, D2>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
>(
  fn: (d1: ValueOf<D1>, d2: ValueOf<D2>, d3: ValueOf<D3>) => T,
  deps: [D1, D2, D3],
): Computed<T, D1, D2, D3>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
  D4 extends Signal = Signal,
>(
  fn: (d1: ValueOf<D1>, d2: ValueOf<D2>, d3: ValueOf<D3>, d4: ValueOf<D4>) => T,
  deps: [D1, D2, D3, D4],
): Computed<T, D1, D2, D3, D4>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
  D4 extends Signal = Signal,
  D5 extends Signal = Signal,
>(
  fn: (
    d1: ValueOf<D1>,
    d2: ValueOf<D2>,
    d3: ValueOf<D3>,
    d4: ValueOf<D4>,
    d5: ValueOf<D5>,
  ) => T,
  deps: [D1, D2, D3, D4, D5],
): Computed<T, D1, D2, D3, D4, D5>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
  D4 extends Signal = Signal,
  D5 extends Signal = Signal,
  D6 extends Signal = Signal,
>(
  fn: (
    d1: ValueOf<D1>,
    d2: ValueOf<D2>,
    d3: ValueOf<D3>,
    d4: ValueOf<D4>,
    d5: ValueOf<D5>,
    d6: ValueOf<D6>,
  ) => T,
  deps: [D1, D2, D3, D4, D5, D6],
): Computed<T, D1, D2, D3, D4, D5, D6>;
export function computed<
  T = unknown,
  D1 extends Signal = Signal,
  D2 extends Signal = Signal,
  D3 extends Signal = Signal,
  D4 extends Signal = Signal,
  D5 extends Signal = Signal,
  D6 extends Signal = Signal,
  D7 extends Signal = Signal,
>(
  fn: (
    d1: ValueOf<D1>,
    d2: ValueOf<D2>,
    d3: ValueOf<D3>,
    d4: ValueOf<D4>,
    d5: ValueOf<D5>,
    d6: ValueOf<D6>,
    d7: ValueOf<D7>,
  ) => T,
  deps: [D1, D2, D3, D4, D5, D6, D7],
): Computed<T, D1, D2, D3, D4, D5, D6, D7>;
export function computed(...args: unknown[]) {
  return new Computed(...(args as ConstructorParameters<typeof Computed>));
}
