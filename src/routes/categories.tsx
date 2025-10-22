import { createFileRoute } from '@tanstack/react-router'

import { Card, CardContent } from '@/common/components/ui/card.tsx'

import { CategoryList } from '@/features/categories/list-categories'

export const Route = createFileRoute('/categories')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Card className="m-4">
			<CardContent><CategoryList /></CardContent>
		</Card>
	)
}

// function CategoryList() {
// 	const { data } = useQuery({
// 		queryKey: ['categories'],
// 		queryFn: getCategories,
// 	})
//
// 	return (
// 		<ul>
// 			{data?.map(category => (
// 				<li key={category.id}>
// 					{category.name} ({category.type})
// 				</li>
// 			))}
// 		</ul>
// 	)
// }