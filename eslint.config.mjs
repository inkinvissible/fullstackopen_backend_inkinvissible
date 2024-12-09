import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'build/**',
      '*.config.js',
      '*.config.mjs',
      '**/.*'
    ]
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    plugins: {
      stylistic: stylistic,
    },
    rules: {
      "stylistic/indent": [
        "error",
        4,
        {
          SwitchCase: 1,
          VariableDeclarator: "first",
        },
      ],
      "stylistic/linebreak-style": ["error", "windows"],
      "stylistic/quotes": ["error", "single"],
      "stylistic/semi": ["error", "never"],
      "stylistic/no-trailing-spaces": "error",
      "stylistic/eol-last": "error",
    },
  },
];