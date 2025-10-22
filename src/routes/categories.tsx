import { eq } from 'drizzle-orm'

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'

import { db, schema } from '@/integrations/drizzle-db'
import { AuthorizationMiddleware } from '@/integrations/clerk/authorization.middleware.ts'

export const Route = createFileRoute('/categories')({
	component: RouteComponent,
})

function RouteComponent() {
	return <CategoryList />
}

function CategoryList() {
	const { data } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	})

	return (
		<ul>
			{data?.map(category => (
				<li key={category.id}>
					{category.name} ({category.type})
				</li>
			))}
		</ul>
	)
}

const getCategories = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { user, logger } }) => {
		logger.info(`Fetching categories for user: ${user}`)

		return await db.query.Categories.findMany({
			with: { subCategories: { orderBy: schema.SubCategories.name } },
			where: eq(schema.Categories.userId, user),
			orderBy: schema.Categories.name,
		})
	})
