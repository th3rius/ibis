const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = [
  {
    target: 'electron-main',
    entry: { main: './src/main.js' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    module: {
      rules: [
        {
          include: /src/,
          test: /\.(js)$/,
          use: 'babel-loader',
        },
      ],
    },
  },
  {
    entry: { index: './src/index.jsx' },
    target: 'electron-renderer',
    plugins: [new HtmlWebpackPlugin()],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          include: /src/,
          test: /\.(jsx?)$/,
          use: 'babel-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  },
];
