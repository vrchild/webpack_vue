const path = require("path")
const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")
const { DefinePlugin } = require("webpack")

const getStyleLoaders = (pre) => {
  return [
    'vue-style-loader',
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
    path: undefined,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]'
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
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
      // 多进程暂不考虑，项目文件太小，多进程开销过大，得不偿失
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
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
  devtool: 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}.js`
    }
  },
  // webpack解析模板加载选项
  resolve: {
    extensions: ['.vue','.js', '.json'] // 自动补全扩展名
  },
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
    // ↓路由刷新页面404，访问地址的时候到devServer里找资源（source下找资源）但是dist里只有一个index.html，没有一个叫当前path的（如about） 解决：刷新还是返回到index.html
    historyApiFallback: true
  }
}
