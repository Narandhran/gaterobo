module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "line-comment-position": ["error", "above"],
    "no-trailing-spaces": ["error"]
  }
}
