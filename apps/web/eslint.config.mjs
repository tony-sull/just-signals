import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import eslintPluginAstro from "eslint-plugin-astro";
import eslint from "eslint-config";

const gitignorePath = fileURLToPath(pathToFileURL(resolve("./.gitignore")));

export default [
  includeIgnoreFile(gitignorePath),
  ...eslint,
  ...eslintPluginAstro.configs.recommended,
  { rules: { "@typescript-eslint/triple-slash-reference": "off" } },
];
