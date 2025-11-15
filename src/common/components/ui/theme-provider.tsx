// Adapted from https://nisabmohd.vercel.app/tanstack-dark
// TODO: Add selector and "system" theme

import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import * as z from 'zod'

const postThemeValidator = z.union([z.literal('light'), z.literal('dark'), z.literal('system')])
export type Theme = z.infer<typeof postThemeValidator>
const storageKey = '_preferred-theme'

export const getThemeServer = createServerFn().handler(
	() => (getCookie(storageKey) || 'dark') as Theme,
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
	.inputValidator(postThemeValidator)
	.handler(({ data }) => setCookie(storageKey, data))
