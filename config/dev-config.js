module.exports = ({ name, entry, inFolder: src, outFolder: dist, publicFolder }) => ({
  mode: `"development"`,
  entry: {
    main: `"./${src}/${entry}.js"`,
  },
  output: {
    filename: `"[name].bundle.js"`,
    path: `path.resolve(__dirname, "${dist}")`
  },
  plugins: [
    `new HtmlWebpackPlugin({
      templateParameters: {
        PROJECT_NAME: "${name}"
      },
      template: './${publicFolder}/index.html'
    })`,
    `new CopyWebpackPlugin([
			{
				from: "${publicFolder}",
				to: "./",
				toType: "dir",
				ignore: [".DS_Store", "index.html"],
			}
		])`
  ],
  module: {
    rules: [
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
      },
      {
        test: `/\.scss$/i`,
        use: [
          `"style-loader"`, // 3. js => style tag
          `"css-loader"`, // 2. css => js
          `"sass-loader"` // 1. sass => css
        ],
      },
      {
        test: `/\.css$/i`,
        use: [
          `"style-loader"`, // 2. js => style tag
          `"css-loader"`, // 1. css => js
        ],
      },
    ]
  }
})