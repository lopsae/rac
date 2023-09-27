
const config = {
  // verbose: true,
  rootDir: '../',
  testMatch: [
      '**/tests/*.tests.js'],
  coverageThreshold: {
      global: {
        branches: 50,
        functions: 50,
        lines: 100,
        statements: 50
      },
      './src/drawable/*.js': {
        lines: 100
      }
    }
};

module.exports = config;