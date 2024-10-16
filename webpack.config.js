const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { optimize } = require('webpack');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js', // Use [name] and [contenthash] for unique filenames
        clean: true
    },
    devServer: {
        port: 9001,
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        hot: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            },
            {
                test: /\.css$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: '' }, // Copy all files from public to dist/public
            ],
        }),
    ],
    performance: {
        maxAssetSize: 1024 * 1024, // Increase asset size limit to 1 MiB
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: 'all',
        },
    },
};
