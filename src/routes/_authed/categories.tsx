import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent } from '@/common/components/ui/card'
import { AllCategoryList } from '@/features/categories/queries/list-categories/client'

export const Route = createFileRoute('/_authed/categories')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Card className="m-4">
			<CardContent>
				<AllCategoryList />
			</CardContent>
		</Card>
	)
}
