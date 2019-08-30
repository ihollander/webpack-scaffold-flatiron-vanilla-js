module.exports = (answers) => {
  const { name, entry, inFolder: src } = answers;
  return ({
    "name": name,
    "version": "1.0.0",
    "main": `${src}/${entry}.js`,
    "license": "MIT",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "webpack --watch",
      "build": "webpack",
      "start": "webpack-dev-server --open"
    },
    "devDependencies": {
      "@babel/core": "^7.4.3",
      "@babel/preset-env": "^7.4.3",
      "@babel/register": "^7.4.0",
      "babel-loader": "^8.0.5",
      "clean-webpack-plugin": "^2.0.1",
      "css-loader": "^2.1.1",
      "html-webpack-plugin": "^3.2.0",
      "style-loader": "^0.23.1",
      "webpack": "^4.29.6",
      "webpack-cli": "^3.3.0",
      "copy-webpack-plugin": "^5.0.1",
    },
    "dependencies": {
      "@babel/polyfill": "^7.4.3"
    }
  })
}