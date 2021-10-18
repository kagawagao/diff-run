module.exports = {
  preset: '@opd/jest-preset-pangu',
  transformIgnorePatterns: ['/node_modules/', '/src/.umi/'],
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!./**/*.d.ts',
    '!src/.umi/**/*.ts',
  ],
  testEnvironment: 'node',
}
