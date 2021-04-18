const { merge } = require('webpack-merge')
const common = require('./common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common('production'), {
  devtool: 'source-map',
  output: {
    publicPath: './',
    filename: 'js/[name].[contenthash].js',
  },
  watchOptions: {
    aggregateTimeout: 600,
  },
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
  ],
})
