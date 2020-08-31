const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const commonConfig = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
}

module.exports = [
    Object.assign(
        {
            target: 'electron-main',
            entry: { main: './src/main.js' }
        },
        commonConfig
    ),
    Object.assign(
        {
            target: 'electron-renderer',
            entry: { index: './src/index.jsx' },
            plugins: [new HtmlWebpackPlugin()]
        },
        commonConfig
    )
]
