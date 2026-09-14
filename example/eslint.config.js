// Flat config. @react-native/eslint-config is still shipped in eslintrc format, so it is bridged
// through FlatCompat rather than imported directly.
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  {
    // eslint.config.js is excluded because the shared config parses .js with
    // @babel/eslint-parser, which needs a Babel config this directory does not have.
    ignores: [
      'lib/**',
      'node_modules/**',
      'android/**',
      'ios/**',
      'vendor/**',
      'eslint.config.js',
    ],
  },
  ...compat.extends('@react-native'),
];
