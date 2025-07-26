import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

const prettierignorePath = fileURLToPath(new URL('.prettierignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(prettierignorePath),
	globalIgnores(['static/js/*']),
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		},
		rules: {}
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: [],
				parser: ts.parser
			}
		}
	}
);
