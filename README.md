[![npm][npm]][npm-url]
[![node][node]][node-url]
![npm](https://img.shields.io/npm/dw/devtools-ignore-webpack-plugin.svg)

# DevTools Ignore Webpack Plugin

A Webpack plugin to ignore-listing code in Chrome devtools.
To see how ignore-listing helps your development experience, check out [this offical demo](https://developer.chrome.com/blog/devtools-better-angular-debugging/).
This plugin is based on the plugin implemented in Angular CLI project.

## Installation

```bash
npm install --save-dev devtools-ignore-webpack-plugin
```

## Usage

```js
const DevToolsIgnorePlugin = require('devtools-ignore-webpack-plugin')

module.exports = {
  // ...,
  plugins: [
    new DevToolsIgnorePlugin()
  ]
}
```

## Options

Currently, this plugin only supports one option: `shouldIgnorePath`. It is a function that checks whether a file should be ignored. The function takes a single argument, which is the path of the file. It should return a boolean value.

```js
new DevToolsIgnorePlugin({
  shouldIgnorePath: function(path) {
    if (path.includes('my-lib')) {
      return false;
    }
    return path.includes("/node_modules/") || path.startsWith("webpack/");
  }
})
```

When not specified, the default function is:
```js
function defaultShouldIgnorePath(path) {
  return path.includes("/node_modules/") || path.startsWith("webpack/");
}
```

[npm]: https://img.shields.io/npm/v/devtools-ignore-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/devtools-ignore-webpack-plugin

[node]: https://img.shields.io/node/v/devtools-ignore-webpack-plugin.svg
[node-url]: https://nodejs.org