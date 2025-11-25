import { Sun, Moon } from 'lucide-react'

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
		<Button suppressHydrationWarning variant="secondary" onClick={selectNextTheme}>
			{context.appTheme === 'light' ? <Sun /> : <Moon />}
			{context.userTheme === 'system' && <span className="font-bold">Auto</span>}
		</Button>
	)
}
