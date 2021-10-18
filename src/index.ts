import debug from './debug'
import { exec } from 'child_process'
import signale from 'signale'
import chalk from 'chalk'
import { promisify } from 'util'
import { getRepoInfo } from './utils'

export interface DiffRunOptions {
  debug?: boolean
}

const getChangeset = async () => {
  debug('get git changeset')

  const repoInfo = await getRepoInfo()

  debug('repo info:', JSON.stringify(repoInfo, null, 2))
  if (!repoInfo.sha) {
    signale.info('No reversion found in current repo')
  } else {
    try {
      const { stdout } = await promisify(exec)(`git rev-list --count HEAD`)
      const commitCount = parseInt(stdout.trim())
      if (commitCount < 2) {
        return []
      }
      const { stdout: changeset } = await promisify(exec)(
        'git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD'
      )

      return changeset
    } catch (error) {
      signale.error(
        'get changeset error: %s',
        chalk.red((error as Error).message)
      )
      return []
    }
  }
}

const diffRun = async (options: DiffRunOptions = {}) => {
  debug('diff-run started')

  const changeset = await getChangeset()

  console.log(changeset)
}

export default diffRun
