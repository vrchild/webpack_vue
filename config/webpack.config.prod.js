const path = require('path')
const EslintWebpackPLugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssminimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { DefinePlugin } = require("webpack")

const getStyleLoaders = (pre) => {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    { // 配合package.json中的browserslist处理css的兼容性
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  entry: {
    path: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[contenthash:10].js',
    chunkFilename: 'static/js/[name].[contenthash:10].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
    clean: true
  },
  module: {
    rules: [
      // css
      {
        test: /\.css$/,
        use: getStyleLoaders()
      },
      {
        test: /\.less$/,
        use: getStyleLoaders('less-loader')
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders('sass-loader')
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders('stylus-loader')
      },
      // 图片
      {
        test: /\.(jpe?g|png|svg|gif|webp)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10*1024
          }
        }
      },
      // 处理其他资源 字体 图标等
      {
        test: /\.woff2|ttf/,
        type: 'asset/resource' // 原封不动输出
      },
      // js
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false, // 缓存的内容不压缩
        }
      },
      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new EslintWebpackPLugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintCache')
      // 多进程暂不考虑，项目文件太小，多进程开销过大，得不偿失
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:10].css',
      chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new VueLoaderPlugin(),
    // cross-env定义的环境变量给打包工具使用
    //DefinePlugin 定义的环境变量是给源代码使用的，从而解决vue3页面警告的问题
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`
    },
    minimizer: [ // 压缩
      new CssminimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", {interlaced: true}],
              ["jpegtran", {progressive: true}],
              ["optipng", {optimizationLevel: 5}],
              [
                "svgo",
                {
                  plugins: [
                    'preset-default',
                    'prefixIds',
                    {
                      name: 'sortAttrs',
                      params: {
                        xmlnsOrder: 'alphabetical'
                      }
                    }
                  ]
                },
              ],
            ],
          }
        }
      })
    ]
  },
  // webpack解析模板加载选项
  resolve: {
    extensions: ['.vue','.js', '.json'] // 自动补全扩展名
  }
}
