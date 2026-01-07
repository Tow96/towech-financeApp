import { eq } from 'drizzle-orm'

import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

import {
	ACTIVITY_CHECK_INTERVAL_SECONDS,
	SESSION_COOKIE,
	TOKEN_SEPARATOR,
	deleteSessionCookie,
	fromHexString,
	generateSessionCookie,
	getSessionFromDb,
	hashSecret,
} from '@/features/sessions/common'

import { db, schema } from '@/database'

export const AuthorizationMiddleware = createMiddleware().server(async ({ next }) => {
	// Checks if users are disabled for testing
	const mockId = import.meta.env.VITE_MOCK_USER_ID
	if (mockId !== undefined)
		return next({ context: { userId: (mockId as string).trim(), sessionId: '' } })

	const token = getCookie(SESSION_COOKIE)
	if (token === undefined) throw new Response('Unauthorized', { status: 401 })

	const session = await validateToken(token)
	if (!session) {
		deleteSessionCookie()
		throw new Response('Unauthorized', { status: 401 })
	}

	generateSessionCookie(token)
	return next({ context: { userId: session.userId, sessionId: session.id } })
})

const validateToken = async (token: string) => {
	const now = new Date()

	const tokenParts = token.split(TOKEN_SEPARATOR)
	if (tokenParts.length !== 2) return null

	const sessionId = tokenParts[0]
	const sessionSecret = tokenParts[1]

	const session = await getSessionFromDb(sessionId)
	if (!session) return null

	// Validate secret
	const tokenSecretHash = await hashSecret(sessionSecret)
	const validSecret = constantTimeEqual(tokenSecretHash, fromHexString(session.secretHash))
	if (!validSecret) return null

	// Refresh session
	if (now.getTime() - session.lastVerifiedAt.getTime() >= ACTIVITY_CHECK_INTERVAL_SECONDS * 1000) {
		session.lastVerifiedAt = now
		await db
			.update(schema.Sessions)
			.set({ lastVerifiedAt: now })
			.where(eq(schema.Sessions.id, sessionId))
	}

	return session
}

const constantTimeEqual = (a: Uint8Array, b: Uint8Array) => {
	if (a.byteLength !== b.byteLength) return false

	let c = 0
	for (let i = 0; i < a.byteLength; i++) c |= a[i] ^ b[i]

	return c === 0
}
