import { createFileRoute } from '@tanstack/react-router'

import { CategoryPage } from '@/pages/category-page'

export const Route = createFileRoute('/_authed/categories')({
	component: CategoryPage,
})
