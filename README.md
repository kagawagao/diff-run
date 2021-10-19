# Diff Run

> run command after file reversion change, use with `post-merge` hook

[![build](https://github.com/kagawagao/diff-run/actions/workflows/build.yml/badge.svg)](https://github.com/kagawagao/diff-run/actions/workflows/build.yml)
[![version](https://badgen.net/npm/v/diff-run)](https://www.npmjs.com/package/diff-run)
[![version](https://badgen.net/npm/license/diff-run)](https://www.npmjs.com/package/diff-run)
[![version](https://badgen.net/npm/node/diff-run)](https://www.npmjs.com/package/diff-run)
[![version](https://badgen.net/npm/dm/diff-run)](https://www.npmjs.com/package/diff-run)
[![version](https://badgen.net/npm/types/diff-run)](https://www.npmjs.com/package/diff-run)

## Usage

### Install

```bash
npm i diff-run
```

### Use with [husky](https://github.com/typicode/husky)

- create `post-merge` in `husky` config directory
- add script into `post-merge`

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx diff-run
```

## Config

support all configurations which support by [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig)

- `diffrun` in `package.json`
- a JSON or YAML, extensionless "rc file", such as `.diffrunrc`
- an "rc file" with the extensions .json, .yaml, .yml, .js, or .cjs, such as `diffrunrc.json`
- a `diffrun.config.js` or `diffrun.config.cjs` CommonJS module

config in `Array` will be executed in order. Otherwise, it will be executed concurrently

```javascript
module.exports = [
  {
    'package.json': ['npm ci'],
  },
  {
    '.eslintrc.js': 'npx eslint .',
  },
]
```

```javascript
module.exports = {
  'package.json': ['npm ci'],
  '.eslintrc.js': 'npx eslint .',
}
```
