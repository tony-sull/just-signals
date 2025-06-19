import { Dispose } from "./index.js";
import { Signal } from "./signal.js";
import { Effect } from "./types.js";

export function effect(cb: Effect, deps: Signal[]): Dispose {
  for (const dep of deps) {
    dep.addEventListener("change", cb);
  }

  cb();

  return () => {
    for (const dep of deps) {
      dep.removeEventListener("change", cb);
    }
  };
}
