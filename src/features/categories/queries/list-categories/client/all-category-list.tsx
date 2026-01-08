import { useState } from 'react'
import { Archive, ArchiveRestore, CirclePlus, Ellipsis, Pencil, Plus } from 'lucide-react'

import type { CategoryListItemDto } from '@/core/contracts'

import { Icon } from '@/common/components/icon'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/common/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/components/ui/tabs'
import { capitalizeFirst, cn } from '@/common/lib/utils'

import { CategoryType } from '@/core/entities'
import { AddCategoryDialog } from '@/features/categories/commands/add-category/client'
import {
	DropDrawer,
	DropDrawerContent,
	DropDrawerGroup,
	DropDrawerItem,
	DropDrawerTrigger,
} from '@/common/components/ui/dropdrawer'
import { Button } from '@/common/components/ui/button'
import { EditCategoryDialog } from '@/features/categories/commands/edit-category/client'
import { SetCategoryStatusDialog } from '@/features/categories/commands/set-category-status/client'
import { useCategoryList } from '@/features/categories/queries/list-categories/client/query-store'

export const AllCategoryList = () => {
	const [openAdd, setOpenAdd] = useState(false)

	return (
		<Tabs defaultValue="expense">
			<div className="flex flex-col-reverse gap-4 md:flex-row md:justify-between">
				<TabsList className="w-full md:w-fit">
					<TabsTrigger value="income">Income</TabsTrigger>
					<TabsTrigger value="expense">Expense</TabsTrigger>
					<TabsTrigger value="transfer">Transfer</TabsTrigger>
				</TabsList>

				{/* Add Category */}
				<Button onClick={() => setOpenAdd(true)}>
					<Plus />
					Add Category
				</Button>
				<AddCategoryDialog open={openAdd} setOpen={setOpenAdd} />
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
}

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

// TODO: It is likely that the Category List Item and the SubCategory List Item can be joined into one component
interface CategoryListItemProps {
	category: CategoryListItemDto
}

const CategoryListItem = ({ category }: CategoryListItemProps) => {
	const [openEdit, setOpenEdit] = useState(false)
	const [openAddSub, setOpenAddSub] = useState(false)
	const [openStatus, setOpenStatus] = useState(false)

	return (
		<AccordionItem value={category.id}>
			{/* Main body */}
			<div className="flex items-center">
				<div className="flex-1">
					<AccordionTrigger
						className="flex min-w-0 items-center"
						empty={
							category.subCategories === null ||
							category.subCategories.length === 0 ||
							category.archived
						}
						disabled={category.archived}>
						<Icon className="h-12 w-12 rounded-full" id={category.iconId} name={category.name} />
						<span className="flex-1 overflow-x-hidden text-xl text-nowrap text-ellipsis">
							{capitalizeFirst(category.name)}
						</span>
					</AccordionTrigger>
				</div>

				{/* Side menu */}
				<DropDrawer>
					{/* Open menu button */}
					<DropDrawerTrigger asChild>
						<Button variant="secondary" size="icon" className="ml-3">
							<Ellipsis />
						</Button>
					</DropDrawerTrigger>

					{/*	Menu content */}
					<DropDrawerContent align="start">
						{!category.archived ? (
							<>
								<DropDrawerGroup>
									<DropDrawerItem icon={<CirclePlus />} onClick={() => setOpenAddSub(true)}>
										<span>Add Subcategory</span>
									</DropDrawerItem>
								</DropDrawerGroup>
								<DropDrawerGroup>
									<DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
										<span>Edit Category</span>
									</DropDrawerItem>
									<DropDrawerItem
										icon={<Archive />}
										onClick={() => setOpenStatus(true)}
										variant="destructive">
										<span>Archive Category</span>
									</DropDrawerItem>
								</DropDrawerGroup>
							</>
						) : (
							<DropDrawerGroup>
								<DropDrawerItem icon={<ArchiveRestore />} onClick={() => setOpenStatus(true)}>
									<span>Restore Category</span>
								</DropDrawerItem>
							</DropDrawerGroup>
						)}
					</DropDrawerContent>
				</DropDrawer>

				{/* Forms */}
				<AddCategoryDialog
					id={category.id}
					type={category.type}
					open={openAddSub}
					setOpen={setOpenAddSub}
				/>
				<SetCategoryStatusDialog
					id={category.id}
					archive={!category.archived}
					open={openStatus}
					setOpen={setOpenStatus}
				/>
				<EditCategoryDialog
					type={category.type}
					id={category.id}
					open={openEdit}
					setOpen={setOpenEdit}
				/>
			</div>

			{/*	Subcategories */}
			{category.subCategories && category.subCategories.length > 0 && (
				<AccordionContent>
					{category.subCategories.map(c => (
						<SubCategoryListItem key={c.subId} subCategory={c} />
					))}
				</AccordionContent>
			)}
		</AccordionItem>
	)
}

interface SubCategoryListItemProps {
	subCategory: CategoryListItemDto
}

const SubCategoryListItem = ({ subCategory }: SubCategoryListItemProps) => {
	const [openEdit, setOpenEdit] = useState(false)
	const [openStatus, setOpenStatus] = useState(false)

	return (
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
			<SetCategoryStatusDialog
				id={subCategory.id}
				subId={subCategory.subId!}
				archive={!subCategory.archived}
				open={openStatus}
				setOpen={setOpenStatus}
			/>
			<EditCategoryDialog
				type={subCategory.type}
				id={subCategory.id}
				subId={subCategory.subId!}
				open={openEdit}
				setOpen={setOpenEdit}
			/>

			<DropDrawer>
				{/* Open menu button */}
				<DropDrawerTrigger asChild>
					<Button variant="secondary" size="icon" className="ml-3">
						<Ellipsis />
					</Button>
				</DropDrawerTrigger>

				{/* Menu */}
				<DropDrawerContent>
					{!subCategory.archived && (
						<DropDrawerGroup>
							{/*	Edit*/}
							<DropDrawerItem icon={<Pencil />} onClick={() => setOpenEdit(true)}>
								<span>Edit Subcategory</span>
							</DropDrawerItem>

							{/*	Archive */}
							<DropDrawerItem
								icon={<Archive />}
								onClick={() => setOpenStatus(true)}
								variant="destructive">
								<span>Archive Subcategory</span>
							</DropDrawerItem>
						</DropDrawerGroup>
					)}

					{subCategory.archived && (
						<DropDrawerGroup>
							{/*	Restore */}
							<DropDrawerItem icon={<ArchiveRestore />} onClick={() => setOpenStatus(true)}>
								<span>Restore Subcategory</span>
							</DropDrawerItem>
						</DropDrawerGroup>
					)}
				</DropDrawerContent>
			</DropDrawer>
		</div>
	)
}
