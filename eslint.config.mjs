import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser },
  rules: {
    eqeqeq: "off",
    "no-unused-vars": "error",
    "no-console":"warn",
    "no-unused-expressions":"error",
    "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
  },
  "globals":{
    "process":"readonly",
  }

},
  
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];