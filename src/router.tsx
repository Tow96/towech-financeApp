import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { routeTree } from './routeTree.gen'

import type { ReactNode } from 'react'

import { TanstackQueryProvider, getContext } from '@/ui/components'

export function getRouter() {
	const rqContext = getContext()

	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: 'intent',
		Wrap: (props: { children: ReactNode }) => (
			<TanstackQueryProvider {...rqContext}>{props.children}</TanstackQueryProvider>
		),
	})

	setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })
	return router
}
