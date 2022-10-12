module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:unicorn/all",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["simple-import-sort"],
  rules: {
    "no-console": "error",
    eqeqeq: ["error", "always", { null: "ignore" }],

    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    "unicorn/no-null": "off",
    "unicorn/no-keyword-prefix": "off",
  },

  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      parserOptions: {
        project: "./tsconfig.json",
      },
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/all",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
      ],
      rules: {
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
          },
        ],
        "@typescript-eslint/prefer-readonly-parameter-types": [
          "error",
          { ignoreInferredTypes: true, treatMethodsAsReadonly: true },
        ],
        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/no-type-alias": "off",
        "@typescript-eslint/parameter-properties": [
          "error",
          { prefer: "parameter-property" },
        ],
      },
    },
    {
      files: ["**/.eslintrc.*", "**/*.config.*"],
      rules: {
        "unicorn/prefer-module": "off",
      },
    },
  ],
};
