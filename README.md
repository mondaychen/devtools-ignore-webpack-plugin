[![npm][npm]][npm-url]
[![node][node]][node-url]
![npm](https://img.shields.io/npm/dw/devtools-ignore-webpack-plugin.svg)

# DevTools Ignore Webpack Plugin

A Webpack plugin to ignore-listing code in Chrome devtools.
To see how ignore-listing helps your development experience, check out [this offical demo](https://developer.chrome.com/blog/devtools-better-angular-debugging/).
This plugin is based on the plugin implemented in Angular CLI project.

**Note:** This plugin is only for Webpack 5.

## Installation

```bash
npm install --save-dev devtools-ignore-webpack-plugin
```

## Usage

First, follow [webpack's guide](https://webpack.js.org/configuration/devtool/) to enable source maps in your project. **Please note that the "inline" source map options are not supported yet.**

Then, add the plugin to your webpack config:

```js
const DevToolsIgnorePlugin = require("devtools-ignore-webpack-plugin");

module.exports = {
  // ...,
  plugins: [new DevToolsIgnorePlugin()],
};
```

## Options

Currently, this plugin supports two options: `shouldIgnorePath` and `potentialSourceMapExtension`.

# shouldIgnorePath

`shouldIgnorePath` is a function that checks whether a source file should be ignored. The function takes a single argument, which is the path of the file. It should return a boolean value.

```js
new DevToolsIgnorePlugin({
  shouldIgnorePath: function (path) {
    if (path.includes("my-lib")) {
      return false;
    }
    return path.includes("/node_modules/") || path.includes("/webpack/");
  },
});
```

When not specified, the default function is:

```js
function defaultShouldIgnorePath(path) {
  return path.includes("/node_modules/") || path.includes("/webpack/");
}
```

# potentialSourceMapExtension

`potentialSourceMapExtension` is a function that checks whether a map file is potentially a source map. The function takes a single argument, which is the name of the potential source map file. It should return a boolean value.

Note: This should rarely be needed. Known scenarios include only looking at `.js.map` in rare scenarios where you have other files that end in `.map`

```js
new DevToolsIgnorePlugin({
  potentialSourceMapExtension: function (name) {
    return name.endsWith(".js.map"); // if you have other files that end in .map
  },
});
```

When not specified, the default function is:

```js
function defaultPotentialSourceMapExtension(name) {
  return name.endsWith(".map");
}
```

[npm]: https://img.shields.io/npm/v/devtools-ignore-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/devtools-ignore-webpack-plugin
[node]: https://img.shields.io/node/v/devtools-ignore-webpack-plugin.svg
[node-url]: https://nodejs.org
