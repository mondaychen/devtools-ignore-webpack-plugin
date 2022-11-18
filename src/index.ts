/**
 * This source code is based on a webpack plugin from the Angular CLI project
 * https://github.com/angular/angular-cli/blob/f3087dc4343f0dac26ffd7c633e7dcf3618db2b7/packages/angular_devkit/build_angular/src/webpack/plugins/devtools-ignore-plugin.ts
 * which is licensed under MIT.
 */

import { Compilation, Compiler } from "webpack";

// Following the naming conventions from
// https://sourcemaps.info/spec.html#h.ghqpj1ytqjbm
const IGNORE_LIST = "x_google_ignoreList";

const PLUGIN_NAME = "devtools-ignore-plugin";

interface SourceMap {
  sources: string[];
  [IGNORE_LIST]: number[];
}

interface PluginOptions {
  shouldIgnorePath?: (path: string) => boolean;
}

interface ValidatedOptions extends PluginOptions {
  shouldIgnorePath: Required<PluginOptions>["shouldIgnorePath"];
}

function defaultShouldIgnorePath(path: string): boolean {
  return path.includes("/node_modules/") || path.startsWith("webpack/");
}

/**
 * This plugin adds a field to source maps that identifies which sources are
 * vendored or runtime-injected (aka third-party) sources. These are consumed by
 * Chrome DevTools to automatically ignore-list sources.
 */
class DevToolsIgnorePlugin {
  options: ValidatedOptions;

  constructor(options: PluginOptions = {}) {
    this.options = {
      shouldIgnorePath: options.shouldIgnorePath ?? defaultShouldIgnorePath,
    };
  }

  apply(compiler: Compiler) {
    const { RawSource } = compiler.webpack.sources;

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING,
          additionalAssets: true,
        },
        (assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            // Instead of using `asset.map()` to fetch the source maps from
            // SourceMapSource assets, process them directly as a RawSource.
            // This is because `.map()` is slow and can take several seconds.
            if (!name.endsWith(".map")) {
              // Ignore non source map files.
              continue;
            }

            const mapContent = asset.source().toString();
            if (!mapContent) {
              continue;
            }

            const map = JSON.parse(mapContent) as SourceMap;
            const ignoreList = [];

            for (const [index, path] of map.sources.entries()) {
              if (this.options.shouldIgnorePath(path)) {
                ignoreList.push(index);
              }
            }

            map[IGNORE_LIST] = ignoreList;
            compilation.updateAsset(name, new RawSource(JSON.stringify(map)));
          }
        }
      );
    });
  }
}

// @ts-ignore: a hack to make it work for both CommonJS and ES modules
DevToolsIgnorePlugin.default = DevToolsIgnorePlugin;
export = DevToolsIgnorePlugin;