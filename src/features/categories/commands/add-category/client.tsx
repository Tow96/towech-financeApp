import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button.tsx'
import { CategoryType } from '@/features/categories/domain'

export const AddCategoryButton = () => {
	const [open, setOpen] = useState(false)

	const formSchema = z.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long.' })
			.max(50, { message: 'Name cannot exceed 50 characters.' }),
		type: z.enum(CategoryType),
		iconId: z.number(),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			iconId: 0
		}
	})

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				<Plus />
				Add Category
			</Button>
		</>
	)
}
