const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//   const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = [
    {
        mode: "development",
        entry: './app.js',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './',
            hot: true,
            port:9000, 
            // host:'30.10.61.70'
        },
        resolve:{
            alias:{
                foxview:path.resolve(__dirname,'../../packages/foxview/lib/index.js'),
                "foxview-ui":path.resolve(__dirname,'../../packages/foxview-ui')
            }
        },
        module:{
            rules:[
                {
                    test:/\.js$/,
                    use:'babel-loader',
                },{
                    test:/\.css$/,
                    use:[
                        {
                            loader: 'style-loader'
                          },
                          {
                            loader: 'css-loader'
                          }
                    ]
                }
            ]
        },
        plugins: [
            //   new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
                title: 'Hot Module Replacement',
                // filename:'foxview.html',
                template:path.resolve(__dirname,'./index.html')
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
        output: {
            filename: 'foxview.bundle.js',
            path: path.resolve(__dirname,'./build')
        }
    }
]
