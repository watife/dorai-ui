module.exports = {
  roots: ['<rootDir>/lib', '<rootDir>/__tests__'],
  // transform: {
  //   '^.+\\.jsx?$': require.resolve('babel-jest'),
  //   '^.+\\.tsx$': 'ts-jest'
  // },
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true
}
