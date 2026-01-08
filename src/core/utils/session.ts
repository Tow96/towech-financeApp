import { subtle } from 'node:crypto'
import { Google } from 'arctic'
import { setCookie } from '@tanstack/react-start/server'

export const SESSION_COOKIE_NAME = 'session'
export const SESSION_TOKEN_SEPARATOR = '.'
export const SESSION_INACTIVIY_TIMEOUT_SECONDS = 60 * 60 * 24 * 15 // 15 days
export const SESSION_ACTIVITY_CHECK_INTERVAL_SECONDS = 60 * 60 // 1 hour

export const hashSecret = async (secret: string) => {
	const secretBytes = new TextEncoder().encode(secret)
	const secretHashBuffer = await subtle.digest('SHA-256', secretBytes)
	return new Uint8Array(secretHashBuffer)
}

export const toHexString = (bytes: Uint8Array) =>
	Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')

export const fromHexString = (hexString: string) =>
	Uint8Array.from(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? [])

export const deleteSessionCookie = () => {
	setCookie(SESSION_COOKIE_NAME, '', {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: 1,
		sameSite: 'lax',
	})
}

export const generateSessionCookie = (token: string) => {
	setCookie(SESSION_COOKIE_NAME, token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: SESSION_INACTIVIY_TIMEOUT_SECONDS,
		sameSite: 'lax',
	})
}

// GOOGLE OAUTH ---------------------------------
export const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state'
export const GOOGLE_CODE_VERIFIER_COOKIE = 'google_code_verifier'

export const googleAuth = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.GOOGLE_CALLBACK_DOMAIN}/login/google/callback`,
)
