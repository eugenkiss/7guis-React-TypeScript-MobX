const path = require('path')
const exec = require('child_process').execSync
const webpack = require('webpack')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PORT = process.env['PORT'] || '5001'
const OUTPUT = process.env['OUTPUT'] || 'dist'

const isBuild = process.env['BUILD'] === 'true'
const isDev = !isBuild

const cfg = {}
cfg.context = root('src')

if (isBuild) {
  cfg.devtool = 'source-map'
} else {
  cfg.devtool = 'cheap-module-eval-source-map'
}

cfg.entry = {
  main: './app/index'
}

cfg.output = {
  path: root(OUTPUT),
  publicPath: '/',
  filename: isBuild ? 'js/[name].[hash].js' : 'js/[name].js',
  chunkFilename: isBuild ? '[id].[hash].chunk.js' : '[id].chunk.js',
}

cfg.target = 'web'

cfg.resolve = {
  extensions: ['.ts', '.js', '.jsx', '.tsx']
}

cfg.module = {
  loaders: [
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
]

cfg.plugins.push(
  new CopyWebpackPlugin([{
    from: root('src/public')
  }]),
)

if (isBuild) {
  cfg.plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: {
          passes: 3,
        }
      }
    }),
  )
} else {
  cfg.plugins.push(
    new HtmlWebpackPlugin({
      template: root('src', 'public', 'template.html'),
      inject: 'body',
    }),
  )
}

cfg.devServer = {
  contentBase: root('src', 'public'),
  hot: false,
  historyApiFallback: true,
  port: PORT,
  stats: {
    warnings: false,
  },
}

module.exports = cfg

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.join.apply(path, [__dirname].concat(args))
}
