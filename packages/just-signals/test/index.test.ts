import { expect, suite, test } from "vitest";
import { computed, effect, signal } from "../src/index";

suite("signal", () => {
  test("stores the latest value", () => {
    const a = signal(1);
    expect(a.value).toEqual(1);

    a.value = 2;
    expect(a.value).toEqual(2);
  });
});

suite("computed", () => {
  test("is reactive", () => {
    const a = signal(1);
    const b = signal(2);
    const c = computed(() => {
      return a.value + b.value;
    }, [a, b]);

    expect(c.value).toEqual(3);

    a.value = 2;

    expect(c.value).toEqual(4);
  });
});

suite("effect", () => {
  test("is reactive", () => {
    const a = signal(1);

    let lastValue = -1;
    const cb = () => {
      lastValue = a.value;
    };
    effect(cb, [a]);

    expect(lastValue).toEqual(1);

    a.value = 2;

    expect(lastValue).toEqual(2);
  });

  test("can be disposed", () => {
    const a = signal(1);

    let lastValue = -1;
    const cb = () => {
      lastValue = a.value;
    };
    const dispose = effect(cb, [a]);

    expect(lastValue).toEqual(1);

    a.value = 2;
    expect(lastValue).toEqual(2);

    dispose();

    a.value = 3;
    expect(lastValue).toEqual(2);
  });
});
