#!/usr/bin/env node
const chalk = require('chalk')
const { program } = require('commander')
const _debug = require('debug')
const diffRun = require('../lib').default
const pkg = require('../package.json')

require('please-upgrade-node')(pkg, {
  message: (requiredVersion) => {
    return chalk.yellowBright(
      'diff-run required ' +
        chalk.redBright('Node@' + requiredVersion.trim()) +
        ' or above'
    )
  },
})

program
  .version(pkg.version)
  .option('-p, --path', 'specific config file path')
  .option('-c, --cwd', 'specific work directory')
  .option('-d, --debug', 'enable debug mode')
  .option('-a, --auto', 'auto run tasks', true)
  .option('--no-auto', 'disable auto run tasks')
  .parse(process.argv)

const options = program.opts()

if (options.debug) {
  _debug.enable('diff-run*')
}

diffRun({
  ...options,
  version: pkg.version,
})
