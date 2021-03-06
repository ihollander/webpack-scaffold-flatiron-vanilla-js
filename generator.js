const Generator = require('yeoman-generator');
const { List, Input, InputValidate } = require('@webpack-cli/webpack-scaffold');

const createProdConfig = require('./config/prod-config');
const createDevConfig = require('./config/dev-config');
const createPackageJson = require('./config/package-json');
const createGitignore = require('./config/gitignore');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      prod: {
        webpackOptions: {}
      },
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
      entry: 'index',
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
      this.answers.publicFolder = (answers.publicFolder !== '') ? answers.publicFolder : this.defaults.publicFolder;
      this.manager[this.answers.manager] = true

      // DEV
      this.options.env.configuration.dev.webpackOptions = createDevConfig(this.answers)
      this.options.env.configuration.dev.topScope = [
        "const path = require('path')",
        "const HtmlWebpackPlugin = require('html-webpack-plugin')",
        "const CopyWebpackPlugin = require('copy-webpack-plugin')"
      ]
      this.options.env.configuration.dev.configName = 'dev';

      // PROD
      this.options.env.configuration.prod.webpackOptions = createProdConfig(this.answers)
      this.options.env.configuration.prod.topScope = [
        "const path = require('path')",
        "const { CleanWebpackPlugin } = require('clean-webpack-plugin')",
        "const MiniCssExtractPlugin = require('mini-css-extract-plugin')",
        "const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')",
        "const TerserPlugin = require('terser-webpack-plugin')",
        "const HtmlWebpackPlugin = require('html-webpack-plugin')",
        "const CopyWebpackPlugin = require('copy-webpack-plugin')"
      ]
      this.options.env.configuration.prod.configName = 'prod';

    })
  }
  writing() {
    const { name, entry, inFolder: src, publicFolder } = this.answers;
    this.destinationRoot(name) // create project directory

    this.config.set('configuration', this.options.env.configuration);

    this.fs.extendJSON(this.destinationPath('package.json'), createPackageJson(this.answers));
    this.fs.write(".gitignore", createGitignore(this.answers));

    // html template
    this.fs.copyTpl(
      this.templatePath(`public/index.html`),
      this.destinationPath(`${publicFolder}/index.html`),
      { title: this.answers.name }
    );

    // additional templates
    const templates = [
      { src: 'public/favicon.ico', dist: `${publicFolder}/favicon.ico` },
      { src: 'src/index.js', dist: `${src}/${entry}.js` },
      { src: 'src/index.css', dist: `${src}/index.css` }
    ]

    templates.forEach(template => {
      this.fs.copyTpl(
        this.templatePath(template.src),
        this.destinationPath(template.dist)
      );
    })

  }
  install() {
    // git init
    this.spawnCommandSync('git', ['init']);
    // => Installs dependencies
    this.installDependencies(this.manager);
  }
};