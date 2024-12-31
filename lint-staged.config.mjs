/**
 * lint-staged.config.mjs
 * @ref https://www.npmjs.com/package/lint-staged
 */
export default {
  '*.{js,mjs,cjs,ts,mts,jsx,tsx}': [
    'eslint --fix',
  ],

  '*.vue': [
    'eslint --fix',
  ],

  '*.{css,scss}': [
    'stylelint --fix --allow-empty-input',
    'prettier --write',
  ],

  '!(pnpm-lock).{yml,yaml}': [
    'prettier --write',
  ],
};
