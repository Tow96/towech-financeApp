// @ts-check

/** @type {import('prettier').Config} */
const config = {
	plugins: ['prettier-plugin-tailwindcss'],
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: true,
	bracketSpacing: true,
	arrowParens: 'avoid',
	trailingComma: 'all',
	bracketSameLine: true,
	printWidth: 100,
	endOfLine: 'crlf',
}

export default config
