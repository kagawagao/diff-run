import commandExists from 'command-exists';
import signale from 'signale';
import getGitRepoInfo from 'git-repo-info';

export const getRepoInfo = async () => {
  let isGitExists = false;
  try {
    await commandExists('git');
    isGitExists = true;
  } catch (error) {
    isGitExists = false;
  }

  if (!isGitExists) {
    signale.error('Git command not found');
    process.exit(1);
  }

  const repoInfo = getGitRepoInfo();

  return repoInfo;
};
