import { createFileRoute } from '@tanstack/react-router'

import { CategoryPage } from '@/ui/pages'

export const Route = createFileRoute('/_authed/categories')({
	component: CategoryPage,
})
