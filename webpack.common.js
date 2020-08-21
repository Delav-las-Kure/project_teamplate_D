const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");



module.exports = env => {
    process.env.NODE_ENV = env;
    console.log(process.env.NODE_ENV);
    return {
        mode: env,
        devtool: process.env.NODE_ENV === "production" ? "" : "source-map",
        context: path.resolve(__dirname, 'src'),
        entry: {
            app: './app',
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: process.env.NODE_ENV === "production" ? './' : '/',
            filename: '[name].js',
            chunkFilename: 'lib/chunk-[name].js',
        },
        /*externals: {///если надо подключать внешние файлы через script, но оставить import, но без внедрения в бандл
            jquery: 'jQuery'
        },*/
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        name: 'vendor',
                        chunks: 'all',
                    },
                    libs: {
                        minSize: 3000,
                        test: /[\\/]lib[\\/]js[\\/]/,
                        chunks: 'all',
                        name: 'lib',
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    }

                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env'],
                            }
                        },
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                                importLoaders: 1
                            },
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                                config: {
                                    path: './postcss.config.js',
                                    ctx: {
                                        env: env,
                                    }
                                },

                            }
                        }]
                }, {
                    test: /\.(scss|sass)$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                                publicPath: '../'
                            }
                        },
                        {
                            loader: "css-loader", // translates CSS into CommonJS
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                                importLoaders: 2,
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                                config: {
                                    path: './postcss.config.js',
                                    ctx: {
                                        env: env,
                                    }
                                },

                            }
                        }, {
                            loader: "sass-loader", // compiles Sass to CSS
                            options: {
                                sourceMap: process.env.NODE_ENV !== "production",
                            }
                        }],
                }, {
                    test: /\.(pug|jade)$/,
                    use: [
                        {
                            loader: 'pug-loader',
                            options: {
                                pretty: true,
                            }
                        }
                    ],

                }, {
                    test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.wav$|\.mp3$|\.webm$|\.mp4$/,
                    exclude: [/fonts/],
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[folder]/[name].[ext]',
                                useRelativePath: false
                            }
                        }
                    ]
                }, {
                    test: /\.woff$|\.woff2$|\.svg$|\.eot$|\.ttf$/,
                    exclude: [/img/],
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/',
                                publicPath: process.env.NODE_ENV === "production" ? '../fonts/' : '',
                                useRelativePath: false
                            }
                        }
                    ]
                },


            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
            modules: ["node_modules"]
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(__dirname, './tsconfig.json')
            }),
            new CleanWebpackPlugin(),///очистка dist
            new MiniCssExtractPlugin({ filename: "css/[name].css" }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env)
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                //Swiper: ["swiper","default"]
            }),
            ...generateHtmlPlugins('src'),
        ]
    }
};


function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
    return templateFiles.filter((item) => {
        const parts = item.split('.')
        const extension = parts[parts.length - 1]
        return /pug/.test(extension) || /html/.test(extension)
    }).map(item => {
        // Split names and extension
        const parts = item.split('.')
        const extension = parts[parts.length - 1]
        parts.splice(parts.length - 1, 1)
        const name = parts.join('.')

        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
        })
    })
}