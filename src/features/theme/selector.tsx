import { Moon, Sun } from 'lucide-react'

import { Button } from '@/common/components/ui/button'
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
			<Sun className="light:inline light:system:inline hidden" />
			<Moon className="dark:inline system:dark:inline hidden" />
			<span className="system:inline hidden font-bold">Auto</span>
		</Button>
	)
}
