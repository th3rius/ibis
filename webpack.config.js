"use strict";

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP;

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
      entry: path.resolve("src/index.tsx"),
      target: "electron-renderer",
      resolve: {
        extensions: [".mjs", ".js", ".ts", ".tsx", ".jsx"],
      },
      output: {
        path: path.resolve("dist/"),
        pathinfo: isEnvDevelopment,
        filename: "index.js",
        globalObject: "this",
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false,
          }),
        ],
      },
      module: {
        strictExportPresence: true,
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
              plugins: [
                [
                  "babel-plugin-named-asset-import",
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                      },
                    },
                  },
                  "styled-jsx/babel",
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
        minimizer: [
          new TerserPlugin({
            extractComments: false,
          }),
        ],
      },
      module: {
        rules: [
          {
            test: /\.(ts)$/,
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
              cacheDirectory: true,
              compact: isEnvProduction,
            },
          },
          {
            test: /\.(m?js|node)$/,
            parser: {amd: false},
            use: {
              loader: "@vercel/webpack-asset-relocator-loader",
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
