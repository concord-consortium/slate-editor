import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import sass from "rollup-plugin-sass";

import * as esrever from "esrever";
import * as immutable from "immutable";
import * as React from "react";
import * as ReactDOM from "react-dom";

import packageJson from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    resolve({
      browser: true
    }),
    typescript(),
    commonjs({
      include: ["node_modules/**"],
      exclude: ["**/*.stories.js"]
    }),
    sass({
      output: "build/index.css"
    })
  ]
};
