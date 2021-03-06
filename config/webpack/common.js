const path = require('path')
const fs = require('fs')
const paths = require('../paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  console.log(env)
  return {
    devtool: 'eval-source-map',
    context: paths.root,
    entry: {
      app: `${paths.src}/app`,
    },
    output: {
      path: paths.build,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFilename: 'lib/[name].chunk.[chunkhash].js',
      clean: true,
      module: true,
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
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(scss|sass|css)$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
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
        {
          test: /\.(pug|jade)$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true,
              },
            },
          ],
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.svg$/,
          exclude: [/fonts/],
          type: 'asset',
          generator: {
            filename: 'images/[name].[hash][ext][query]',
          },
        },
        {
          test: /\.wav$|\.mp3$|\.webm$|\.mp4$/,
          exclude: [/fonts/, /images/],
          type: 'asset/resource',
          generator: {
            filename: 'media/[name].[hash][ext][query]',
          },
        },
        {
          test: /\.woff$|\.woff2$|\.svg$|\.eot$|\.ttf$/,
          exclude: [/images/],
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext][query]',
          },
        },
      ],
    },
    experiments: {
      topLevelAwait: true,
      outputModule: true,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
      modules: ['node_modules'],
      alias: {
        '@': `${paths.src}`,
        images: `${paths.src}/images`,
        assets: `${paths.root}/public/assets`,
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${paths.public}/assets`,
          },
        ],
      }),
      ...generateHtmlPlugins('src'),
    ],
  }
}

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(paths.root, templateDir))
  return templateFiles
    .filter((item) => {
      const parts = item.split('.')
      const extension = parts[parts.length - 1]
      return /pug/.test(extension) || /html/.test(extension)
    })
    .map((item) => {
      // Split names and extension
      const parts = item.split('.')
      const extension = parts[parts.length - 1]
      parts.splice(parts.length - 1, 1)
      const name = parts.join('.')

      return new HtmlWebpackPlugin({
        filename: `${name}.html`,
        template: path.resolve(paths.root, `${templateDir}/${name}.${extension}`),
      })
    })
}
