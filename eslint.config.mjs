import tsEslintParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsEslintParser,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 0,
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
];
