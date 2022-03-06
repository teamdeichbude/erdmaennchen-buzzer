module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: [],
  rules: {
    curly: 'error',

    'no-nested-ternary': 'error',

    'max-len': [
      'warn',
      {
        code: 160,
        ignorePattern: '^\\s*import.*from',
        ignoreUrls: true,
      },
    ],

    'max-lines': ['warn', 2000],
    '@typescript-eslint/explicit-function-return-type': 'off', // disabled for .js file compatibility. gets enabled for .ts files in "overrides"-settings below.
    '@typescript-eslint/explicit-module-boundary-types': ['off'], // disabled for .js file compatibility. gets enabled for .ts files in "overrides"-settings below.
    '@typescript-eslint/no-non-null-assertion': ['off'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],

    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['camelCase', 'UPPER_CASE'],
      },
    ],

    semi: 'off',
    '@typescript-eslint/semi': ['off'],
  },
  overrides: [],
};
