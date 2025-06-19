import type { Signal } from "./signal.js";

export type Effect = () => void;
export type Dispose = () => void;
export type ValueOf<T extends Signal> = T["value"];
