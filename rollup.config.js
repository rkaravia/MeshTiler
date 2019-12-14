import css from "rollup-plugin-css-only";
import copy from "rollup-plugin-copy";
import svelte from "rollup-plugin-svelte";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

if (!process.env.MAPTILER_KEY) {
  console.error(
    "ERROR: MAPTILER_KEY environment variable is missing, see README.md for more information."
  );
  process.exit();
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/bundle.js"
  },
  plugins: [
    css({ output: "public/global.css" }),

    copy({
      targets: [
        { src: "screenshot.png", dest: "public/images" },
        { src: "node_modules/leaflet/dist/images", dest: "public" }
      ]
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write("public/bundle.css");
      }
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee =>
        importee === "svelte" || importee.startsWith("svelte/")
    }),

    replace({
      MAPTILER_KEY: process.env.MAPTILER_KEY
    }),

    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};