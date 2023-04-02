/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  'extends': [
    'standard',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    // alwaysTryTypes: true,
    // settings: {
    //   'import/resolver': {
    //     typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    //   },
    // },
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-vue',
    'eslint-import-resolver-typescript'
  ],
}
