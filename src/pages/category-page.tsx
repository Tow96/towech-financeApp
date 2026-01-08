import { Card, CardContent } from '@/ui/components'

import { AllCategoryList } from '@/features/categories/queries/list-categories/client'

export const CategoryPage = () => {
	return (
		<Card className="m-4">
			<CardContent>
				<AllCategoryList />
			</CardContent>
		</Card>
	)
}
