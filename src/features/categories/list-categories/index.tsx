import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'
import { useQuery } from '@tanstack/react-query'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs.tsx'

import { AuthorizationMiddleware } from '@/integrations/clerk/authorization.middleware.ts'
import { db, schema } from '@/integrations/drizzle-db'

const getCategories = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.handler(async ({ context: { user, logger } }) => {
		logger.info(`Fetching categories for user: ${user}`)

		return await db.query.Categories.findMany({
			with: { subCategories: { orderBy: schema.SubCategories.name } },
			where: eq(schema.Categories.userId, user),
			orderBy: schema.SubCategories.name,
		})
	})

export function CategoryList() {
	const { data } = useQuery({
		queryKey: ['categories'],
		queryFn: getCategories,
	})

	return (
		<Tabs defaultValue="expense">
			<TabsList>
				<TabsTrigger value="income">Income</TabsTrigger>
				<TabsTrigger value="expense">Expense</TabsTrigger>
				<TabsTrigger value="transfer">Transfer</TabsTrigger>
			</TabsList>

			{/* Income tab */}
			<TabsContent value="income">
				{JSON.stringify(data?.filter(c => c.type === 'INCOME'))}
			</TabsContent>
			<TabsContent value="expense">
				{JSON.stringify(data?.filter(c => c.type === 'EXPENSE'))}
			</TabsContent>
			<TabsContent value="transfer">
				{JSON.stringify(data?.filter(c => c.type === 'TRANSFER'))}
			</TabsContent>
		</Tabs>
	)
}
