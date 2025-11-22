import { useState } from 'react'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/common/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { Icon } from '@/common/components/icon'
import { capitalizeFirst } from '@/common/lib/utils'

import { CategoryType } from '@/features/categories/domain'
import { useCategoryList } from '@/features/categories/queries/list-categories/client/query-store'

interface CategorySelectorValue {
	type: CategoryType
	id: string | null
	subId: string | null
}

interface CategorySelectorProps {
	className?: string
	value?: CategorySelectorValue
	onChange?: (c: CategorySelectorValue) => void
	disabled?: boolean
}

const VALUE_SEPARATOR = '%'

export const CategorySelector = (props: CategorySelectorProps) => {
	const [internalValue, setInternalValue] = useState<CategorySelectorValue>({
		type: CategoryType.expense,
		id: null,
		subId: null,
	})
	const convertValueForSelector = (v: CategorySelectorValue) => {
		let output = `${v.type.toString()}`
		if (v.id) output += `${VALUE_SEPARATOR}${v.id}`
		if (v.subId) output += `${VALUE_SEPARATOR}${v.subId}`
		return output
	}

	const handleValueChange = (v: string) => {
		const splitValue = v.split(VALUE_SEPARATOR)
		const vCategory: CategorySelectorValue = {
			type: (splitValue[0] || 'EXPENSE') as CategoryType,
			id: splitValue[1] ?? null,
			subId: splitValue[2] ?? null,
		}
		setInternalValue(vCategory)
		if (props.onChange) props.onChange(vCategory)
	}

	return (
		<Select
			disabled={props.disabled}
			value={convertValueForSelector(props.value ?? internalValue)}
			onValueChange={handleValueChange}>
			<SelectTrigger className="!h-12 w-full">
				<SelectValue placeholder="Select a category" />
			</SelectTrigger>
			<SelectContent>
				<Tabs defaultValue={props.value?.type.toString() ?? internalValue.type.toString()}>
					<TabsList>
						<TabsTrigger value={CategoryType.income.toString()}>Income</TabsTrigger>
						<TabsTrigger value={CategoryType.expense.toString()}>Expense</TabsTrigger>
						<TabsTrigger value={CategoryType.transfer.toString()}>Transfer</TabsTrigger>
					</TabsList>
					<TabsContent value={CategoryType.income.toString()}>
						<CategorySelectionList type={CategoryType.income} />
					</TabsContent>
					<TabsContent value={CategoryType.expense.toString()}>
						<CategorySelectionList type={CategoryType.expense} />
					</TabsContent>
					<TabsContent value={CategoryType.transfer.toString()}>
						<CategorySelectionList type={CategoryType.transfer} />
					</TabsContent>
				</Tabs>
			</SelectContent>
		</Select>
	)
}

interface CategorySelectionListProps {
	type: CategoryType
}

const CategorySelectionList = ({ type }: CategorySelectionListProps) => {
	const categories = useCategoryList(type)
	const uncategorizedName = `Uncategorized ${type.toString().toLowerCase()}`

	return (
		<>
			{/* No category of that type	*/}
			<SelectItem value={`${type.toString()}`} className="border-b-1 last:border-b-0">
				<Icon className="h-8 w-8" id={4} name="Uncategorized" />
				<span className="text-lg">{uncategorizedName}</span>
			</SelectItem>

			{categories.data
				?.filter(c => !c.archived)
				.map(category => (
					<div key={category.id} className="border-b-1 last:border-b-0">
						<SelectItem
							value={`${category.type}${VALUE_SEPARATOR}${category.id}`}
							className="border-b-1 py-2 last:border-b-0">
							<Icon className="h-8 w-8" id={category.iconId} name={category.name} />
							<span className="text-lg">{capitalizeFirst(category.name)}</span>
						</SelectItem>

						{category.subCategories?.map(subCategory => (
							<SelectItem
								key={subCategory.subId}
								value={`${subCategory.type}${VALUE_SEPARATOR}${subCategory.id}${VALUE_SEPARATOR}${subCategory.subId}`}
								className="border-b-1 py-2 pl-10 last:border-b-0">
								<Icon className="h-8 w-8" id={subCategory.iconId} name={subCategory.name} />
								<span className="text-lg">{capitalizeFirst(subCategory.name)}</span>
							</SelectItem>
						))}
					</div>
				))}
		</>
	)
}
