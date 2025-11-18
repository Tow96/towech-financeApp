import { subtle } from 'node:crypto'

import { setCookie } from '@tanstack/react-start/server'
import { db, schema } from '@/integrations/drizzle-db'
import { eq } from 'drizzle-orm'

export const SESSION_COOKIE = 'session'
export const INACTIVITY_TIMEOUT_SECONDS = 60 * 60 * 24 * 15 // 15 days
export const ACTIVITY_CHECK_INTERVAL_SECONDS = 60 * 60 // 1 hour

export const TOKEN_SEPARATOR = '.'

export const hashSecret = async (secret: string) => {
	const secretBytes = new TextEncoder().encode(secret)
	const secretHashBuffer = await subtle.digest('SHA-256', secretBytes)
	return new Uint8Array(secretHashBuffer)
}

export const toHexString = (bytes: Uint8Array) =>
	Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')

export const fromHexString = (hexString: string) =>
	Uint8Array.from(hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? [])

export const generateSessionCookie = (token: string) => {
	setCookie(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: INACTIVITY_TIMEOUT_SECONDS,
		sameSite: 'lax',
	})
}

export const deleteSessionCookie = () => {
	setCookie(SESSION_COOKIE, '', {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: 1,
		sameSite: 'lax',
	})
}

export const getSessionFromDb = async (sessionId: string) => {
	const now = new Date()

	const result = await db.select().from(schema.Sessions).where(eq(schema.Sessions.id, sessionId))
	if (result.length !== 1) return null

	const session = result[0]

	// Inactivity timeout
	if (now.getTime() - session.lastVerifiedAt.getTime() >= INACTIVITY_TIMEOUT_SECONDS * 1000) {
		await deleteSessionFromDb(sessionId)
		return null
	}

	return session
}

const deleteSessionFromDb = async (sessionId: string) => {
	await db.delete(schema.Sessions).where(eq(schema.Sessions.id, sessionId))
}
