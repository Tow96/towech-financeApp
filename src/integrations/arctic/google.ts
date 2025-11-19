import { Google } from 'arctic'

export const GOOGLE_OAUTH_STATE_COOKIE = 'google_oauth_state'

export const GOOGLE_CODE_VERIFIER_COOKIE = 'google_code_verifier'

export const googleAuth = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.GOOGLE_CALLBACK_DOMAIN}/login/google/callback`,
)
