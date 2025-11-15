import { generateCodeVerifier, generateState } from 'arctic'
import { setCookie } from '@tanstack/react-start/server'
import { createFileRoute } from '@tanstack/react-router'

import {
	GOOGLE_CODE_VERIFIER_COOKIE,
	GOOGLE_OAUTH_STATE_COOKIE,
	googleAuth,
} from '@/integrations/arctic/google'

export const Route = createFileRoute('/login/google/')({
	server: {
		handlers: {
			GET: () => {
				const state = generateState()
				const codeVerifier = generateCodeVerifier()
				const url = googleAuth.createAuthorizationURL(state, codeVerifier, ['openid', 'profile'])

				setCookie(GOOGLE_OAUTH_STATE_COOKIE, state, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV !== 'development',
					maxAge: 60 * 10, // 10 minutes
					sameSite: 'lax',
				})
				setCookie(GOOGLE_CODE_VERIFIER_COOKIE, codeVerifier, {
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV !== 'development',
					maxAge: 60 * 10, // 10 minutes
					sameSite: 'lax',
				})

				return new Response(null, {
					status: 302,
					headers: { Location: url.toString() },
				})
			},
		},
	},
})
