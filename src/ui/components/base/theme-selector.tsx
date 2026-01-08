import { Moon, Sun } from 'lucide-react'

import { useTheme } from './theme-provider'

import { Button } from './button'

export const ThemeSelector = () => {
	const context = useTheme()

	const selectNextTheme = () => {
		if (context.userTheme === 'light') context.setTheme('dark')
		if (context.userTheme === 'dark') context.setTheme('system')
		if (context.userTheme === 'system') context.setTheme('light')
	}

	return (
		<Button variant="secondary" onClick={selectNextTheme}>
			<Sun className="light:inline system:light:inline hidden" />
			<Moon className="system:dark:inline hidden dark:inline" />
			<span className="system:inline hidden font-bold">Auto</span>
		</Button>
	)
}
