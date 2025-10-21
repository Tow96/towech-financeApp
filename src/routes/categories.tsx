import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'
import { db, schema } from '@/integrations/drizzle-db'
import { eq } from 'drizzle-orm'

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

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
	return await db.query.Categories.findMany({
		with: { subCategories: { orderBy: schema.SubCategories.name }},
		where: eq(schema.Categories.userId, 'TestingUser'),
		orderBy: schema.Categories.name,
	})
})
