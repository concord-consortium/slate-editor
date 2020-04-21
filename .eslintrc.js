// default configuration tuned for development
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    env: {
      browser: true,
      es6: true,
      jest: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    settings: {
      react: {
        pragma: "React",
        version: "detect"
      }
    },
    ignorePatterns: [
      "build/", "node_modules/"
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "ignoreRestSiblings": true }],
      curly: ["error", "multi-line", "consistent"],
      eqeqeq: ["error", "smart"],
      "no-debugger": "off",
      "react/prop-types": "off",
      semi: ["error", "always"]
    }
};
