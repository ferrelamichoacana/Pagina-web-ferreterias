const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',          // alias @ apunta a la raíz
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy'
  }
}

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()
  return config
}
