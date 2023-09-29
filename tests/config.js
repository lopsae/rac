
// Configuration for Jest 29.7
// https://jestjs.io/docs/configuration

let config = {
  // verbose: true,
  rootDir: '../',
  testMatch: [
      '**/tests/*.tests.js'],
  coverageReporters: ["lcov"],
  coverageThreshold: {
      global: {
        branches: 40,
        functions: 40,
        lines: 40,
        statements: 40
      },
      './src/drawable/*.js': {
        lines: 50
      }
    }
};

// Complete Coverage Files
[
  './src/drawable/Angle.js',
  './src/drawable/Point.js',
  // './src/drawable/Ray.js',
  './src/drawable/Segment.js',
  './src/drawable/Arc.js',
  './src/drawable/Text.js',
  './src/drawable/Text.Format.js',
  './src/drawable/instance.Angle.js',
  './src/drawable/instance.Point.js',
  './src/drawable/instance.Ray.js',
  './src/drawable/instance.Segment.js',
  './src/drawable/instance.Arc.js',
  './src/drawable/instance.Bezier.js',
  './src/drawable/instance.Text.js',
].forEach(item => {
  config.coverageThreshold[item] = {lines: 100};
});

config.coverageThreshold['./src/drawable/Ray.js'] = {lines: 80};


module.exports = config;