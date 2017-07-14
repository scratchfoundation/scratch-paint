const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const webpack = require('webpack');

// Plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');

// PostCss
var autoprefixer = require('autoprefixer');
var postcssVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

const base = {
    devtool: 'cheap-module-source-map',
    externals: {
        React: 'react',
        ReactDOM: 'react-dom'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: path.resolve(__dirname, 'src'),
            options: {
                plugins: ['transform-object-rest-spread'],
                presets: ['es2015', 'react']
            }
        },
        {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    camelCase: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    ident: 'postcss',
                    plugins: function () {
                        return [
                            postcssImport,
                            postcssVars,
                            autoprefixer({
                                browsers: ['last 3 versions', 'Safari >= 8', 'iOS >= 8']
                            })
                        ];
                    }
                }
            }]
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: 'lib.min.js'
        })
    ].concat(process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ] : [])
};

module.exports = [
    // For the playground
    defaultsDeep({}, base, {
        devServer: {
            contentBase: path.resolve(__dirname, 'playground'),
            host: '0.0.0.0',
            port: process.env.PORT || 8078
        },
        entry: {
            lib: ['react', 'react-dom'],
            playground: './src/playground/playground.jsx'
        },
        output: {
            path: path.resolve(__dirname, 'playground'),
            filename: '[name].js'
        },
        plugins: base.plugins.concat([
            new HtmlWebpackPlugin({
                template: 'src/playground/index.ejs',
                title: 'Scratch 3.0 Paint Editor Playground'
            })
        ])
    }),
    // For use as a library
    defaultsDeep({}, base, {
        entry: {
            'lib': ['react', 'react-dom'],
            'scratch-paint': './src/index.js'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        }
    })
];
