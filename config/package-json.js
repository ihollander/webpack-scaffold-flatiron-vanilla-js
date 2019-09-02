module.exports = answers => {
  const { name, entry, inFolder: src } = answers;
  return ({
    "name": name,
    "version": "1.0.0",
    "main": `${src}/${entry}.js`,
    "license": "MIT",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "build": "webpack --config=webpack.prod.js",
      "start": "webpack-dev-server --config=webpack.dev.js --open"
    },
    "devDependencies": {
      "@babel/core": "^7.4.3",
      "@babel/preset-env": "^7.4.3",
      "@babel/register": "^7.4.0",
      "babel-loader": "^8.0.5",
      "clean-webpack-plugin": "^3.0.0",
      "copy-webpack-plugin": "^5.0.1",
      "css-loader": "^2.1.1",
      "file-loader": "^4.2.0",
      "html-loader": "^0.5.5",
      "html-webpack-plugin": "^3.2.0",
      "mini-css-extract-plugin": "^0.8.0",
      "optimize-css-assets-webpack-plugin": "^5.0.3",
      "style-loader": "^0.23.1",
      "terser-webpack-plugin": "^1.4.1",
      "webpack": "^4.29.6",
      "webpack-cli": "^3.3.0",
      "webpack-dev-server": "^3.8.0",
    },
    "dependencies": {
      "@babel/polyfill": "^7.4.3"
    }
  })
}