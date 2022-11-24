import path from "path";
// import alias from "@rollup/plugin-alias";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import replace from 'rollup-plugin-re';
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import visualizer from "rollup-plugin-visualizer";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";

import packageJson from "./package.json";

export default [{
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
    // alias({
    //   entries: [
    //     { find: 'slate-react', replacement: '@concord-consortium/slate-react' }
    //   ]
    // }),
    external(),
    resolve({
      browser: true
    }),
    typescript(),
    commonjs({
      include: ["node_modules/**"],
      exclude: ["**/*.stories.js"]
    }),
    postcss({
      extract: path.resolve("dist/index.css")
    }),
    visualizer({ open: false }) // <== set to true to automatically open visualizer on build
  ]
}, {  // bundle declaration files
  // declaration files root
  input: 'dist/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [
    replace({
      patterns: [{
        // match types files
        match: /\.d\.ts/,
        // ignore .scss imports when bundling types
        test: /import ["'](.*)\.scss['"];/g,
        // string to replace with
        replace: ''
      }]
    }),
    // bundle types into a single index.d.ts file
    dts()
  ]
}];
