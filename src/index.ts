import debug from './debug';
import path from 'path';
import { exec } from 'child_process';
import signale from 'signale';
import chalk from 'chalk';
import { promisify } from 'util';
import { cosmiconfig } from 'cosmiconfig';
import microMatch from 'micromatch';
import { Listr } from 'listr2';
import fs from 'fs';
import { getRepoInfo } from './utils';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';
import inquire from 'inquirer';

const configExplore = cosmiconfig('diffrun');

export interface DiffRunOptions {
  debug?: boolean;
  cwd?: string;
  path?: string;
  auto?: boolean;
  version?: string;
}

const getChangeset = async () => {
  debug('get git changeset');

  const repoInfo = await getRepoInfo();

  debug('repo info:', JSON.stringify(repoInfo, null, 2));
  if (!repoInfo.sha) {
    signale.info('No reversion found in current repo');
    return [];
  } else {
    const { commonGitDir } = repoInfo;

    const origHeadFilePath = path.resolve(commonGitDir, 'ORIG_HEAD');
    const headFilePath = path.resolve(commonGitDir, 'HEAD');

    const reversions = [];

    if (fs.existsSync(headFilePath)) {
      reversions.push('HEAD');
    } else {
      reversions.push(repoInfo.sha);
    }

    if (fs.existsSync(origHeadFilePath)) {
      reversions.unshift('ORIG_HEAD');
    }

    try {
      const { stdout } = await promisify(exec)(`git diff-tree -r --name-only --no-commit-id ${reversions.join(' ')}`);

      return stdout.trim().split('\n');
    } catch (error) {
      signale.error('get changeset error: %s', chalk.red((error as Error).message));
      return [];
    }
  }
};

const diffRun = async (options: DiffRunOptions = {}) => {
  debug('diff-run started');

  const { cwd = process.cwd(), path: configPath, version, auto = true } = options;
  let searchResult: CosmiconfigResult;
  if (configPath) {
    searchResult = await configExplore.load(configPath);
  } else {
    searchResult = await configExplore.search();
  }

  if (!searchResult) {
    process.exit(0);
  } else {
    const { config } = searchResult;
    const configChain = Array.isArray(config) ? config : [config];
    const changeset = await getChangeset();
    const task = new Listr<any>([
      {
        title: 'Running diff-run tasks',
        task: (_, task) => {
          return task.newListr(
            configChain.map((config, index) => {
              return {
                title: `Task ${index + 1}`,
                exitOnError: true,
                task: (_, task) => {
                  return task.newListr(
                    Object.keys(config).map((pattern) => {
                      return {
                        title: pattern,
                        skip: () => {
                          const matches = microMatch(changeset, pattern, {
                            cwd,
                            dot: true,
                            matchBase: !pattern.includes('/'),
                          });
                          return !matches.length;
                        },
                        exitOnError: true,
                        task: async (_, task) => {
                          let commands: string[] | string = config[pattern];
                          commands = Array.isArray(commands) ? commands : [commands];
                          return task.newListr(
                            commands.map((command) => {
                              return {
                                title: command,
                                task: async () => {
                                  await promisify(exec)(command);
                                },
                              };
                            }),
                            {
                              concurrent: false,
                            },
                          );
                        },
                      };
                    }),
                    {
                      concurrent: true,
                    },
                  );
                },
              };
            }),
            {
              concurrent: false,
            },
          );
        },
      },
    ]);
    let shouldRun = false;
    if (auto) {
      shouldRun = true;
    } else {
      const result = await inquire.prompt({
        type: 'confirm',
        name: 'run',
        message: 'Run diff-run tasks right now?',
        default: true,
      });
      shouldRun = result.run;
    }
    try {
      debug(`Running ${chalk.blueBright('diff-run@%s')}`, version);
      if (shouldRun) {
        await task.run();
      }
    } catch (error) {}
  }
};

export default diffRun;
