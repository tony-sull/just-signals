import eslint from "eslint-config";

export default [
  ...eslint,
  {
    ignores: ["dist/*"],
  },
];
