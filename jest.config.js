const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  roots: ['public/src'],
  testMatch: ['<rootDir>/public/src/**/?(*.)test.{ts,tsx}'],
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  verbose: true,
};
