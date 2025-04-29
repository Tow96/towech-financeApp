const nx = require('@nx/eslint-plugin');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            { sourceTag: 'scope:backend', onlyDependOnLibsWithTags: ['scope:backend'] },
            { sourceTag: 'scope:frontend', onlyDependOnLibsWithTags: ['scope:frontend'] },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:infrastructure', 'type:common'],
            },
            {
              sourceTag: 'type:infrastructure',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {},
  },
];
