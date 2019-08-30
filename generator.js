const Generator = require('yeoman-generator');
const { List, Input, InputValidate } = require('@webpack-cli/webpack-scaffold');

const createDevConfig = require('./config/dev-config');
const createPackageJson = require('./config/package-json');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };

    this.manager = {
      yarn: false,
      npm: false,
      bower: false
    }

    this.defaults = {
      name: 'my-js-project',
      inFolder: 'src',
      entry: 'main',
      outFolder: 'dist',
      publicFolder: 'public'
    }
  }
  prompting() {
    const validateName = value => {
      if (value.indexOf(' ') > 0) {
        return 'Invalid name: spaces are not allowed, try again';
      }
      return true;
    }

    return this.prompt([
      InputValidate('name', `How do you want to name your project? (${this.defaults.name})`, validateName),
      Input('inFolder', `Which folder will your source code be in? (${this.defaults.inFolder})`),
      Input('entry', `Which is the entry point of your app? (${this.defaults.entry})`),
      Input('outFolder', `Which folder will your generated bundles be in? (${this.defaults.outFolder})`),
      Input('publicFolder', `Which folder will your public assets be in? (${this.defaults.publicFolder})`),
      List('manager', 'Which package manager do you prefer?', ['npm', 'yarn'])
    ]).then(answers => {
      this.answers = answers;
      this.answers.name = (answers.name !== '') ? answers.name.toLowerCase() : this.defaults.name;
      this.answers.inFolder = (answers.inFolder !== '') ? answers.inFolder : this.defaults.inFolder;
      this.answers.entry = (answers.entry !== '') ? answers.entry : this.defaults.entry;
      this.answers.outFolder = (answers.outFolder !== '') ? answers.outFolder : this.defaults.outFolder;
      this.manager[this.answers.manager] = true

      this.options.env.configuration.dev.webpackOptions = createDevConfig(this.answers)
      this.options.env.configuration.dev.topScope = [
        "const HtmlWebpackPlugin = require('html-webpack-plugin')",
        "const CleanWebpackPlugin = require('clean-webpack-plugin')",
        "const CopyWebpackPlugin = require('copy-webpack-plugin')"
      ]
    })
  }
  writing() {
    this.config.set('configuration', this.options.env.configuration);
    // => We write each json into the right file in the file system
    this.fs.extendJSON(this.destinationPath('package.json'), createPackageJson(this.answers));

    const { name, publicFolder } = this.answers;

    this.fs.copyTpl(
      this.templatePath('public/index.html'),
      this.destinationPath(`${publicFolder}/index.html`),
      { title: name }
    );
  }
  install() {
    // => Installs dependencies using yarn
    this.installDependencies({
      npm: this.answers.manager === 'npm',
      yarn: this.answers.manager === 'yarn'
    });
  }
};