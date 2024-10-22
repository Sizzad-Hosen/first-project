import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier"; // Prettier plugin
import prettierConfig from "eslint-config-prettier"; // Prettier config

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "no-console": "warn",
      "no-unused-expressions": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
    globals: {
      process: "readonly",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier.configs.recommended, // Prettier config from import
  prettierConfig, // Prettier's recommended config to prevent conflicts with ESLint
];
