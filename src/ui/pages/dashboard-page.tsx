import { useState } from 'react'
import { Plus } from 'lucide-react'

import type { PeriodSelectorValue } from '@/ui/components'

import {
	AddMovementDialog,
	BalanceChart,
	Button,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CashFlowChart,
	PeriodSelector,
	RecentMovementList,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@/ui/components'

export const DashboardPage = () => {
	const [openAdd, setOpenAdd] = useState<boolean>(false)

	const [selectedPeriod, setSelectedPeriod] = useState<PeriodSelectorValue>({
		start: new Date(),
		end: new Date(),
	})

	return (
		<>
			<Tabs defaultValue="cash-flow">
				<Card className="mx-4 my-2">
					<CardHeader>
						<TabsList className="w-full">
							<TabsTrigger value="balance">Balance</TabsTrigger>
							<TabsTrigger value="cash-flow">Cash flow</TabsTrigger>
						</TabsList>
					</CardHeader>
					<CardContent className="flex-1">
						<TabsContent value="balance">
							<BalanceChart className="h-[15vh] w-full md:h-[20vh]" period={selectedPeriod} />
						</TabsContent>
						<TabsContent value="cash-flow">
							<CashFlowChart className="h-[15vh] w-full md:h-[20vh]" period={selectedPeriod} />
						</TabsContent>
					</CardContent>
					<CardFooter>
						<PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
					</CardFooter>
				</Card>
			</Tabs>
			<Card className="mx-4 max-h-[48vh] md:max-h-[40vh]">
				<CardHeader className="flex items-center justify-between gap-4">
					<span className="text-2xl">Recent movements</span>
					<Button onClick={() => setOpenAdd(true)}>
						<Plus /> Add
					</Button>
				</CardHeader>
				<CardContent className="overflow-auto">
					<AddMovementDialog open={openAdd} setOpen={setOpenAdd} />
					<RecentMovementList />
				</CardContent>
			</Card>
		</>
	)
}
