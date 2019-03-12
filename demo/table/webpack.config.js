const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//   const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = [
    {
        mode: "development",
        entry: './foxview/app.js',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './',
            hot: true,
            port:9000, 
            // host:'30.10.61.70'
        },
        resolve:{
            alias:{
                foxview:path.resolve(__dirname,'../../lib/index.js')
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
                filename:'foxview.html',
                template:path.resolve(__dirname,'./foxview/index.html')
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        output: {
            filename: 'foxview.bundle.js',
            path: path.resolve(__dirname,'./build')
        }
    },{
        mode: "development",
        entry: './react/app.js',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './',
            hot: true,
            port:9000, 
            host:'30.10.61.70'
        },
        resolve:{
            // alias:{
            //     foxview:path.resolve(__dirname,'../../lib/index.js')
            // }
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
                filename:'react.html',
                template:path.resolve(__dirname,'./react/index.html')
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        output: {
            filename: 'react.bundle.js',
            path: path.resolve(__dirname,'./build')
        }
    }
]
