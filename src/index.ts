import debug from './debug'
import { execSync } from 'child_process'
import signale from 'signale'
import chalk from 'chalk'
import { getRepoInfo } from './utils'

type DiffRunOptions = Record<string, any>

const getChangeset = () => {
  debug('get git changeset')
  try {
    const changeset = execSync(
      'git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD',
      {
        stdio: 'ignore',
      }
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

const diffRun = async (options?: DiffRunOptions) => {
  debug('diff-run started')

  const repoInfo = await getRepoInfo()

  if (!repoInfo.sha) {
    signale.info('No reversion found in current repo')
  } else {
    const changeset = getChangeset()

    console.log(changeset)
  }
}

export default diffRun
