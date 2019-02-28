const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//   const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: './app.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../',
        hot: true, 
        // host:'30.10.61.70'
    },
    resolve:{
        alias:{
            foxview:path.resolve(__dirname,'../lib/index.js')
        }
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:'babel-loader',
            }
        ]
    },
    plugins: [
        //   new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
            template:path.resolve(__dirname,'./index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'./build')
    }
};