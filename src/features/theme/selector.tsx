import { Moon, Sun } from 'lucide-react'

import { Button } from '@/ui/components'
import { useTheme } from '@/features/theme/provider'

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
