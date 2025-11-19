import { decodeIdToken } from 'arctic'
import { eq } from 'drizzle-orm'
import { getCookie } from '@tanstack/react-start/server'
import { createFileRoute } from '@tanstack/react-router'
import type { OAuth2Tokens } from 'arctic'

import { generateSessionCookie } from '@/features/sessions/common'
import { generateSession } from '@/features/sessions/sign-in'

import {
	GOOGLE_CODE_VERIFIER_COOKIE,
	GOOGLE_OAUTH_STATE_COOKIE,
	googleAuth,
} from '@/integrations/arctic/google'
import { db, schema } from '@/integrations/drizzle-db'

interface GoogleIdToken {
	iss: string
	azp: string
	aud: string
	sub: string
	at_hash: string
	picture: string
	name: string
	given_name: string
	family_name: string
	iat: Date
	exp: Date
}

export const Route = createFileRoute('/login/google/callback')({
	server: {
		handlers: {
			GET: async ({ request, context: { logger } }) => {
				const url = new URL(request.url)
				const code = url.searchParams.get('code')
				const state = url.searchParams.get('state')

				const storedState = getCookie(GOOGLE_OAUTH_STATE_COOKIE)
				const codeVerifier = getCookie(GOOGLE_CODE_VERIFIER_COOKIE)
				if (
					code === null ||
					state === null ||
					storedState === undefined ||
					codeVerifier === undefined
				)
					return new Response(null, { status: 400 })

				if (state !== storedState) return new Response(null, { status: 400 })

				let tokens: OAuth2Tokens
				try {
					tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier)
				} catch (e) {
					return new Response(null, { status: 400 })
				}

				const claims = decodeIdToken(tokens.idToken()) as GoogleIdToken
				const googleUserId = claims.sub
				const username = claims.name

				logger.info(`User with id: ${googleUserId} and name ${username} attempting to log in`)
				const user = await db
					.select({ id: schema.Users.id })
					.from(schema.Users)
					.where(eq(schema.Users.googleId, googleUserId))
				if (user.length === 0)
					return new Response(null, {
						status: 302,
						headers: { Location: '/login?unregistered=true' },
					})

				const session = await generateSession(user[0].id)
				generateSessionCookie(session!.token)

				return new Response(null, {
					status: 302,
					headers: { Location: '/' },
				})
			},
		},
	},
})
