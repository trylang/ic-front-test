const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const os = require('os');
const helpers = require('./helpers');

// 定义环境变量
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const SERVER = {
  host: '127.0.0.1',
  port: '63342'
};

module.exports = {
  // cache: true,
  devtool: DEVELOPMENT ? 'eval-source-map' : 'source-map',

  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts',
  },

  output: {
    path: helpers.root('dist'),
    publicPath: DEVELOPMENT ? `http://${SERVER.host}:${SERVER.port}/` : '',
    filename: DEVELOPMENT ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: DEVELOPMENT ? '[id].chunk.js' : '[id].[chunkhash].chunk.js'
  },

  resolve: {
    extensions: ['.ts', '.js', 'json'],
  },

  externals: {
    'CKEDITOR': {
      commonjs: 'CKEDITOR',
      amd: 'CKEDITOR',
      root: 'CKEDITOR'
    }
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: helpers.root('src', 'tsconfig.json')
        }
      }, 'angular-router-loader?debug=false', 'angular2-template-loader']
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      include: [
        helpers.root('src')
      ]
    }, {
      test: /\.(png|jpe?g|gif|ico|svg)$/,
      use: DEVELOPMENT ?
        'url-loader?limit=50000&name=src/asset/image/[name].[hash].[ext]' : 'url-loader?limit=50000&name=src/asset/image/[name].[hash].[ext]&publicPath=./',
      include: [
        helpers.root('src/asset/image'),
        helpers.root('node_modules/primeng/resources')
      ]
    }, {
      test: /\.(ttf|eot|woff|woff2|svg)([\w\?=\.]*)?$/,
      use: DEVELOPMENT ?
        'file-loader?name=fonts/[name].[hash].[ext]' : 'file-loader?name=fonts/[name].[hash].[ext]&publicPath=./',
      include: [
        helpers.root('src/asset/font'),
        helpers.root('node_modules/font-awesome/fonts'),
        helpers.root('node_modules/bootstrap/dist/fonts'),
        helpers.root('node_modules/primeng/resources')
      ]
    }, {
      test: /\.scss$/,
      include: helpers.root('src', 'app'),
      use: [
        'raw-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }, {
      test: /\.scss$/,
      exclude: helpers.root('src', 'app'),
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            },
            sourceMap: true
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.css$/,
      exclude: [
        helpers.root('src', 'app'),
        helpers.root('src/asset/css')
      ],
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: () => {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            },
            sourceMap: true
          }
        }]
      })
    }, {
      test: /\.css$/,
      include: [
        helpers.root('src', 'app'),
        helpers.root('src/asset/css')
      ],
      loaders: [
        'raw-loader'
        // 'css-to-string-loader',
        // 'css-loader'
      ]
    }]
  },

  plugins: [
    // Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),

    // new HardSourceWebpackPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      'window.Popper': ['popper.js', 'default'],
      echarts: 'echarts'
    }),

    new CopyWebpackPlugin([{
      from: helpers.root('/src/asset/image'),
      to: helpers.root('/dist/asset/image'),
      toType: 'dir'
    }, {
      from: helpers.root('/src/asset/lib'),
      to: helpers.root('/dist/asset/lib'),
      toType: 'dir'
    }, {
      from: helpers.root('/src/asset/localdb'),
      to: helpers.root('/dist/asset/localdb'),
      toType: 'dir'
    }, {
      from: helpers.root('/dll'),
      to: helpers.root('/dist/dll'),
      toType: 'dir'
    }, {
      from: helpers.root('/src/asset/css'),
      to: helpers.root('/dist/src/asset/css'),
      toType: 'dir'
    }], {
      ignore: [
        '*.scss',
        '**/font/*'
      ]
    }),

    // 用于去掉浏览器console的warning
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), {}
    ),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(helpers.root('dll/vendor-manifest.json'))
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // minChunks: 2
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      // chunksSortMode: 'dependency'
      chunksSortMode: function(chunk1, chunk2) {
        const orders = ['manifest', 'vendor', 'polyfills', 'app'];
        var order1 = orders.indexOf(chunk1.names[0]);
        var order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        } else {
          return 0;
        }
      }
    }),

    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: DEVELOPMENT // workaround for ng2
      },
      // minimize: PRODUCTION, // 注释掉这行, 会导致 Build PROD, html tag can't found.
      debug: DEVELOPMENT,
      options: {
        context: __dirname
      }
    }),

    // manifest.json
    new ManifestPlugin({
      fileName: 'ark-manifest.json'
    }),

    new ParallelUglifyPlugin({
      workerCount: os.cpus().length,
      cacheDir: '.cache/',
      sourceMap: DEVELOPMENT,
      uglifyJS: {
        compress: {
          warnings: DEVELOPMENT,
          drop_debugger: PRODUCTION,
          drop_console: PRODUCTION
        },
        // comments: DEVELOPMENT,
        mangle: {
          // Skip mangling these
          reserved: ['$super', '$', 'exports', 'require'],
          // screw_ie8: true,
          keep_fnames: true
        }
      }
    }),

    // 定义环境变量
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(PRODUCTION),
      DEVELOPMENT: JSON.stringify(DEVELOPMENT)
    }),

    // 实现文件顶部版权声明
    new webpack.BannerPlugin('Copyright www.proudark.com 2017 inc.')
  ],
  node: {
    console: DEVELOPMENT,
    global: true,
    process: true,
    Buffer: false,
    setImmediate: false,
    // fs: 'empty',
    // net: 'empty',
    // tls: 'empty'
  },
};
