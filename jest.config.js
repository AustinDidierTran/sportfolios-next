const { defaults } = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  bail: true,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  roots: ['public/src'],
  testMatch: ['<rootDir>/public/src/**/?(*.)test.{ts,tsx}'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  verbose: true,
};
