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

const debug = _debug('diff-run')

program
  .version(pkg.version)
  .option('-d, --debug', 'enable debug mode')
  .parse(process.argv)

const options = program.opts()

if (options.debug) {
  _debug.enable('diff-run*')
}

debug(`Running ${chalk.blueBright('diff-run@%s')}`, pkg.version)

diffRun(options)
