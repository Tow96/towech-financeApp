import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent } from '@/common/components/ui/card.tsx'

import { AllCategoryList } from '@/features/categories/queries/list-categories/client.tsx'

export const Route = createFileRoute('/_authed/categories')({
	beforeLoad: () => {},
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
