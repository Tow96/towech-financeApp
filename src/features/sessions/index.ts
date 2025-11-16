// Taken from lucia-auth
import { getRandomValues, subtle } from 'node:crypto'
import { createIsomorphicFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'

import { db, schema } from '@/integrations/drizzle-db'

export const SESSION_COOKIE = 'session'
const inactivityTimeoutSeconds = 60 * 60 * 24 * 15 // 15 days
const activityCheckIntervalSeconds = 60 * 60 // 1 hour

export const generateSessionCookie = createIsomorphicFn().server((token: string) => {
	setCookie(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		maxAge: inactivityTimeoutSeconds,
		sameSite: 'lax',
	})
})

export const generateSession = createIsomorphicFn().server(async (userId: string) => {
	const id = generateSecureRandomString()
	const secret = generateSecureRandomString()
	const secretHash = await hashSecret(secret)
	const now = new Date()

	await db.insert(schema.Sessions).values({
		id,
		userId,
		secretHash: secretHash.join(''),
		lastVerifiedAt: now,
		createdAt: now,
	})

	const token = `${id}.${secret}`
	return {
		id,
		secretHash,
		createdAt: now,
		lastVerifiedAt: now,
		token,
	}
})

const generateSecureRandomString = () => {
	// Human-readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
	const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'

	// Generate 24 bytes = 192 bits of entropy.
	// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
	const bytes = new Uint8Array(24)
	getRandomValues(bytes)

	let id = ''
	for (const x of bytes) id += alphabet[x >> 3]

	return id
}

const hashSecret = async (secret: string) => {
	const secretBytes = new TextEncoder().encode(secret)
	const secretHashBuffer = await subtle.digest('SHA-256', secretBytes)
	return new Uint8Array(secretHashBuffer)
}

// const inactivityTimeoutSeconds = 60 * 60 * 24 * 15 // 15 days
// const activityCheckIntervalSeconds = 60 * 60 // 1 hour
//
// export const validateSessionToken()
