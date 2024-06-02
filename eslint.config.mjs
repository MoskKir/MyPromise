import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
		env: {
			node: true,
			commonjs: true,
			es2021: true,
		},
		extends: 'eslint:recommended',
		parserOptions: {
			ecmaVersion: 'latest',
		},
		rules: {
			quotes: ['error', 'single'],
			indent: ['error', 'tab'],
			'no-tabs': 0,
		},
	},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];