import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import * as TanstackQuery from '@/integrations/tanstack-query/root-provider.tsx'

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext()

	const router = createRouter({
		routeTree,
		context: { ...rqContext },
		defaultPreload: 'intent',
		Wrap: (props: { children: React.ReactNode }) => (
			<TanstackQuery.Provider {...rqContext}>{props.children}</TanstackQuery.Provider>
		),
	})

	setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

	return router
}
