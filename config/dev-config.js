module.exports = answers => {
  const { name, entry, inFolder: src, outFolder: dist, publicFolder } = answers;

  return {
    entry: `"./${src}/${entry}.js"`,
    mode: `"development"`,
    plugins: [
      "new CleanWebpackPlugin()",
      `new HtmlWebpackPlugin({templateParameters:{PROJECT_NAME: "${name}"},template: './${publicFolder}/index.html'})`,
      `new CopyWebpackPlugin([{from: './${publicFolder}',to: './${dist}',toType: 'dir',ignore: ['.DS_Store']}])`,
    ],
    module: {
      rules: [
        {
          test: "/\.css$/",
          use: [`"style-loader"`, `"css-loader"`]
        },
        {
          test: "/\.js$/",
          exclude: "/node_modules/",
          use: {
            loader: `"babel-loader"`,
            options: {
              presets: [`"@babel/preset-env"`]
            }
          }
        }
      ]
    },
    devServer: {
      contentBase: `"./${dist}"`
    }
  }
};