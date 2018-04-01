const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PORT = process.env['PORT'] || '5001'
const OUTPUT = process.env['OUTPUT'] || 'dist'
const PUBLIC_PATH = process.env['PUBLIC_PATH'] || '/'

const isBuild = process.env['BUILD'] === 'true'
const isDev = !isBuild

const cfg = {}

cfg.mode = isBuild ? 'production' : 'development'

cfg.devtool = isBuild ? 'source-map' : undefined

cfg.entry = {
  main: root('src', 'app', 'index.tsx')
}

cfg.output = {
  path: root(OUTPUT),
  publicPath: PUBLIC_PATH,
  filename: isBuild ? 'js/[name].[hash].js' : 'js/[name].js',
  chunkFilename: isBuild ? '[id].[hash].chunk.js' : '[id].chunk.js',
}

cfg.target = 'web'

cfg.resolve = {
  extensions: ['.ts', '.js', '.jsx', '.tsx']
}

cfg.module = {
  rules: [
    {
      test: /\.tsx?$/,
      include: root('src', 'app'),
      use: {
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true,
          useBabel: true,
          babelOptions: {
            babelrc: false,
            plugins: [
              ['emotion', {
                'hoist':  true,
                'sourceMap': !isBuild,
                'autoLabel': !isBuild,
              }],
            ]
          },
        }
      },
    },
  ]
}

cfg.plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(isBuild ? 'production' : 'dev'), // To enable React's optimizations
      'DEV': JSON.stringify(isDev), // For distinguishing between dev and non-dev mode
    }
  }),
  new HtmlWebpackPlugin({
    template: root('src', 'public', 'template.html'),
    inject: 'body',
  }),
  new CopyWebpackPlugin([{
    from: root('src', 'public')
  }]),
]

cfg.devServer = {
  port: PORT,
  contentBase: root('src', 'public'),
  hot: false,
  historyApiFallback: true,
  stats: {
    warnings: true,
  },
}

module.exports = cfg

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}
