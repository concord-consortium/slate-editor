// build/production configuration extends default/development configuration
module.exports = {
    extends: "../.eslintrc.js",
    rules: {
      "@typescript-eslint/no-var-requires": "off"
    }
};
