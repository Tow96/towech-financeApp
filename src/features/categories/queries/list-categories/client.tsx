import { useQuery } from '@tanstack/react-query'

import { categoryKeys } from '../../store-keys'
import { getCategoriesByType } from './server.ts'
import type { CategoryListItemDto, SubCategoryListItemDto } from './dto'

import { Icon } from '@/common/components/icon'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/common/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { capitalizeFirst, cn } from '@/common/lib/utils'

import { CategoryType } from '@/features/categories/domain'
import { AddCategoryButton } from '@/features/categories/commands/add-category/client'

const useCategoryList = (type: CategoryType) => {
	return useQuery({
		queryKey: categoryKeys.list(type),
		staleTime: 60000,
		queryFn: () => getCategoriesByType({ data: { type } }),
	})
}

export const AllCategoryList = () => (
	<Tabs defaultValue="expense">
		<div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
			<TabsList className="w-full md:w-fit">
				<TabsTrigger value="income">Income</TabsTrigger>
				<TabsTrigger value="expense">Expense</TabsTrigger>
				<TabsTrigger value="transfer">Transfer</TabsTrigger>
			</TabsList>
			<AddCategoryButton />
		</div>
		<TabsContent value="income">
			<CategoryListByType type={CategoryType.income} />
		</TabsContent>
		<TabsContent value="expense">
			<CategoryListByType type={CategoryType.expense} />
		</TabsContent>
		<TabsContent value="transfer">
			<CategoryListByType type={CategoryType.transfer} />
		</TabsContent>
	</Tabs>
)

const CategoryListByType = ({ type }: { type: CategoryType }) => {
	const { data } = useCategoryList(type)

	return (
		<Accordion type="multiple" className="max-h-[70vh] overflow-y-auto pr-4">
			{data?.map(item => (
				<CategoryListItem key={item.id} category={item} />
			))}
		</Accordion>
	)
}

interface CategoryListItemProps {
	category: CategoryListItemDto
}

const CategoryListItem = ({ category }: CategoryListItemProps) => (
	<AccordionItem value={category.id}>
		{/* Main body */}
		<div>
			<AccordionTrigger
				className="flex min-w-0 items-center"
				empty={category.subCategories.length === 0 || category.archived}>
				<Icon className="h-12 w-12 rounded-full" id={category.iconId} name={category.name} />
				<span className="flex-1 overflow-x-hidden text-xl text-nowrap text-ellipsis">
					{capitalizeFirst(category.name)}
				</span>
			</AccordionTrigger>
		</div>

		{/*	Subcategories */}
		{category.subCategories.length > 0 && (
			<AccordionContent>
				{category.subCategories.map(c => (
					<SubCategoryListItem key={c.id} subCategory={c} />
				))}
			</AccordionContent>
		)}
	</AccordionItem>
)

interface SubCategoryListItemProps {
	subCategory: SubCategoryListItemDto
}

const SubCategoryListItem = ({ subCategory }: SubCategoryListItemProps) => (
	<div className="flex items-center gap-2 py-3 pl-10">
		<div
			className={cn(
				'flex min-w-0 flex-1 items-center gap-2',
				subCategory.archived ? 'pointer-events-none opacity-50' : '',
			)}>
			<Icon className="h-10 w-10 rounded-full" id={subCategory.iconId} name={subCategory.name} />
			<span className="flex-1 overflow-x-hidden text-lg text-nowrap text-ellipsis">
				{capitalizeFirst(subCategory.name)}
			</span>
		</div>
	</div>
)
