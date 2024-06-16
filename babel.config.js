module.exports = {
  presets: [
    [
      '@pixas/babel-preset-lib',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          node: 14,
        },
      },
    ],
  ],
}
