/**
 * eslint.config.mjs
 * @ref https://eslint.org/
 */

import { antfu } from '@antfu/eslint-config';
import prettierConfig from './prettier.config.mjs';

export default antfu(
  {
    type: 'lib',
    ignores: [
      '**/dist/**',
      '**/dist-*/**',
      '**/dist_*/**',
      'coverage/**',
      'test/example-dest/**',
    ],
    stylistic: {
      semi: prettierConfig.semi,
      indent: prettierConfig.tabWidth,
      quotes: prettierConfig.singleQuote ? 'single' : 'double',
    },
    typescript: {
      overrides: {
        // 不必要显式返回类型
        // @ref https://typescript-eslint.io/rules/explicit-function-return-type/
        'ts/explicit-function-return-type': ['off'],
      },
    },
    rules: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
);
