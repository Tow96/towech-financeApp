// Taken from lucia-auth
import { getRandomValues } from 'node:crypto'
import { createIsomorphicFn } from '@tanstack/react-start'

import { db, schema } from '@/database'

import { TOKEN_SEPARATOR, hashSecret, toHexString } from '@/features/sessions/common'

export const generateSession = createIsomorphicFn().server(async (userId: string) => {
	const id = generateSecureRandomString()
	const secret = generateSecureRandomString()
	const secretHash = await hashSecret(secret)
	const now = new Date()

	await db.insert(schema.Sessions).values({
		id,
		userId,
		secretHash: toHexString(secretHash),
		lastVerifiedAt: now,
		createdAt: now,
	})

	const token = `${id}${TOKEN_SEPARATOR}${secret}`
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
