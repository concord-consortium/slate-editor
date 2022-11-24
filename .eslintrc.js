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
      "plugin:eslint-comments/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended"
    ],
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/member-delimiter-style": "error",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "args": "none", "ignoreRestSiblings": true }],
      "@typescript-eslint/semi": ["error", "always"],
      curly: ["error", "multi-line", "consistent"],
      eqeqeq: ["error", "smart"],
      "eslint-comments/no-unused-disable": "warn",
      "no-debugger": "off",
      "no-shadow": ["error", { "builtinGlobals": false, "hoist": "all", "allow": [] }],
      "no-unused-vars": "off",  // superseded by @typescript-eslint/no-unused-vars
      "prefer-const": ["error", { destructuring: "all" }],
      "react/prop-types": "off",
      semi: "off"
    }
};
