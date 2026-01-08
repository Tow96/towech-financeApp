import { createContext, useContext, useEffect, useState } from 'react'
import { ScriptOnce } from '@tanstack/react-router'
import { createClientOnlyFn, createIsomorphicFn } from '@tanstack/react-start'
import { z } from 'zod'

import type { ReactNode } from 'react'

const UserThemeSchema = z.enum(['light', 'dark', 'system']).catch('system')
const AppThemeSchema = z.enum(['light', 'dark']).catch('light')

export type UserTheme = z.infer<typeof UserThemeSchema>
export type AppTheme = z.infer<typeof AppThemeSchema>

const themeStorageKey = 'app-theme'

export const getStoredTheme = createIsomorphicFn()
	.server((): UserTheme => 'system')
	.client((): UserTheme => UserThemeSchema.parse(localStorage.getItem(themeStorageKey)))

export const setStoredTheme = createClientOnlyFn((theme: UserTheme) =>
	localStorage.setItem(themeStorageKey, theme),
)

const getSystemTheme = createIsomorphicFn()
	.server((): AppTheme => 'light')
	.client(
		(): AppTheme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
	)

const handleThemeChange = createClientOnlyFn((userTheme: UserTheme) => {
	const root = document.documentElement
	root.classList.remove('light', 'dark', 'system')

	if (userTheme === 'system') {
		const systemTheme = getSystemTheme()
		root.classList.add(systemTheme, 'system')
	} else {
		root.classList.add(userTheme)
	}
})

const setupPreferredListener = () => {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
	const handler = () => handleThemeChange('system')

	mediaQuery.addEventListener('change', handler)
	return () => mediaQuery.removeEventListener('change', handler)
}

const themeScript = (function () {
	function themeFn() {
		try {
			const storedTheme = localStorage.getItem('app-theme') || 'system'
			const validTheme = ['light', 'dark', 'system'].includes(storedTheme) ? storedTheme : 'system'

			if (validTheme === 'system') {
				const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'system'
				document.documentElement.classList.add(systemTheme, 'system')
			} else {
				document.documentElement.classList.add(validTheme)
			}
		} catch (e) {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
			document.documentElement.classList.add(systemTheme, 'system')
		}
	}
	return `(${themeFn.toString()})();`
})()

type ThemeContextProps = {
	userTheme: UserTheme
	appTheme: AppTheme
	setTheme: (theme: UserTheme) => void
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

type ThemeProviderProps = {
	children: ReactNode
}
export const ThemeProvider = (props: ThemeProviderProps) => {
	const [userTheme, setUserTheme] = useState<UserTheme>(getStoredTheme)
	const appTheme = userTheme === 'system' ? getSystemTheme() : userTheme

	useEffect(() => {
		if (userTheme !== 'system') return
		return setupPreferredListener()
	}, [userTheme])

	const setTheme = (newUserTheme: UserTheme) => {
		setUserTheme(newUserTheme)
		setStoredTheme(newUserTheme)
		handleThemeChange(newUserTheme)
	}

	return (
		<ThemeContext value={{ userTheme, appTheme, setTheme }}>
			<ScriptOnce children={themeScript} />
			{props.children}
		</ThemeContext>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) throw new Error('ThemeSelector must be used within a ThemeProvider')

	return context
}
