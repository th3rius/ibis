"use strict";

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Source maps are resource heavy and can cause
// out of memory issue for large source files.
const shouldUseSourceMap = Boolean(process.env.GENERATE_SOURCEMAP);

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv.development === true;
  const isEnvProduction = webpackEnv.production === true;

  const buildMode = isEnvProduction
    ? "production"
    : isEnvDevelopment && "development";

  const sourceMapModule = isEnvProduction
    ? shouldUseSourceMap
      ? "source-map"
      : false
    : isEnvDevelopment && "cheap-module-source-map";

  return [
    {
      mode: buildMode,
      devtool: sourceMapModule,
      entry: {index: path.resolve("src/index.tsx")},
      target: "electron-renderer",
      resolve: {
        extensions: [".mjs", ".js", ".ts", ".tsx", ".jsx"],
      },
      output: {
        path: path.resolve("dist/"),
        pathinfo: isEnvDevelopment,
        filename: "[name].js",
        // this defaults to 'window', but by setting it to 'this' then
        // module chunks which are built will work in web workers as well.
        globalObject: "this",
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
      module: {
        strictExportPresence: true,
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-react")],
              plugins: [
                [
                  require.resolve("babel-plugin-named-asset-import"),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                      },
                    },
                  },
                ],
                [
                  require.resolve("styled-jsx/babel"),
                  {
                    optimizeForSpeed: isEnvProduction,
                    sourceMaps: isEnvProduction && shouldUseSourceMap,
                    // we don't need prefixes since we're always on chromium
                    vendorPrefixes: false,
                  },
                ],
              ],
              cacheDirectory: true,
              compact: isEnvProduction,
            },
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve("public/index.html"),
        }),
      ],
    },
    {
      mode: buildMode,
      entry: {
        main: path.resolve("src/main.ts"),
        preload: path.resolve("src/preload.ts"),
      },
      target: "electron-main",
      devtool: sourceMapModule,
      resolve: {
        extensions: [".mjs", ".js", ".ts", ".node"],
      },
      output: {
        path: path.resolve("dist/"),
        pathinfo: isEnvDevelopment,
        filename: "[name].js",
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
      module: {
        rules: [
          {
            test: /\.(ts)$/,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [require.resolve("@babel/preset-typescript")],
              cacheDirectory: true,
              compact: isEnvProduction,
            },
          },
          {
            test: /\.(m?js|node)$/,
            parser: {amd: false},
            use: {
              // Extract native node modules to the build output
              loader: require.resolve("@vercel/webpack-asset-relocator-loader"),
              options: {
                outputAssetBase: "assets",
                production: isEnvProduction,
              },
            },
          },
        ],
      },
    },
  ];
};
