module.exports = answers => {
  const { name, entry, inFolder: src, outFolder: dist } = answers;

  return {
    mode: `"production"`,
    entry: {
      main: `"./${src}/${entry}.js"`,
    },
    output: {
      filename: `"[name].[contentHash].bundle.js"`,
      path: `path.resolve(__dirname, "${dist}")`
    },
    optimization: {
      minimizer: [
        `new OptimizeCssAssetsPlugin()`,
        `new TerserPlugin()`,
        `new HtmlWebpackPlugin({
          templateParameters:{PROJECT_NAME: "${name}"},
          template: "./${src}/index.html",
          minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            removeComments: true
          }
        })`
      ],
      runtimeChunk: `"single"`,
      moduleIds: `"hashed"`,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: `/[\\/]node_modules[\\/]/`,
            name: `"vendor"`,
            chunks: `"all"`
          }
        }
      }
    },
    plugins: [
      `new MiniCssExtractPlugin({
        filename: "[name].[hash].css"
      })`,
      `new CleanWebpackPlugin()`
    ],
    module: {
      rules: [
        {
          test: `/\.scss$/i`,
          use: [
            `MiniCssExtractPlugin.loader`, // 3. extract css to files
            `"css-loader"`, // 2. css => js
            `"sass-loader"` // 1. sass => css
          ],
        },
        {
          test: `/\.css$/i`,
          use: [
            `MiniCssExtractPlugin.loader`, // 2. extract css to files
            `"css-loader"`, // 1. css => js
          ],
        },
        {
          test: `/\.html$/i`,
          use: [`"html-loader"`]
        },
        {
          test: `/\.(svg|png|jpg|gif)$/i`,
          use: {
            loader: `"file-loader"`,
            options: {
              name: `"[name].[hash].[ext]"`,
              outputPath: `"images"`
            }
          }
        },
        {
          test: `/\.js$/`,
          exclude: `/node_modules/`,
          use: {
            loader: `"babel-loader"`,
            options: {
              presets: [`"@babel/preset-env"`]
            }
          }
        }
      ]
    }
  }
};