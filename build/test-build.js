'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'development'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const shell = require('shelljs')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.test.conf')

const spinner = ora('building for test...')
spinner.start()
var assetsPath = path.join(config.test.assetsRoot, config.test.assetsSubDirectory);
shell.rm('-rf', assetsPath);
shell.mkdir('-p', assetsPath);
shell.config.silent = true;
shell.cp('-R', 'static/*', assetsPath);
shell.config.silent = false;
webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');
    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.cyan('  开始上传到服务器.\n'));
    shell.exec('gulp deploy');
});
