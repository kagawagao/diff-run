module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          node: 14,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        version: require('@babel/runtime/package.json').version,
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}
