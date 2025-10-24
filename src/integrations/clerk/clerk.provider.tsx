import { ClerkProvider } from '@clerk/tanstack-react-start'
import { createServerFn } from '@tanstack/react-start'
import { getUserId } from './authorization.middleware.ts'

import type { ReactNode } from 'react'

export const getClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
	const userId = await getUserId()

	return { userId }
})

export const CustomClerkProvider = ({ children }: { children: ReactNode }) => {
	const mockId = import.meta.env.VITE_MOCK_USER_ID
	const disabledUsers = mockId !== undefined && mockId.trim() !== ''

	return disabledUsers ? <>{children}</> : <ClerkProvider>{children}</ClerkProvider>
}
