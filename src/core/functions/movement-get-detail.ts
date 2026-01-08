import { and, eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import type { CategoryType } from '@/core/entities'
import type { MovementDetailDto } from '@/core/contracts'

import { GetMovementDetailSchema } from '@/core/contracts'

import { db, schema } from '@/database'

export const getMovementDetail = createServerFn({ method: 'GET' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(GetMovementDetailSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		logger.info(`User ${userId} requesting detail for movement ${data.id}`)

		const existingMovement = await db.query.Movements.findMany({
			with: { summary: true },
			where: and(eq(schema.Movements.userId, userId), eq(schema.Movements.id, data.id)),
		})
		if (existingMovement.length === 0)
			throw new Response(`Movement ${userId} not found`, { status: 404 })

		const output: MovementDetailDto = {
			id: existingMovement[0].id,
			amount: existingMovement[0].summary[0].amount,
			date: existingMovement[0].date,
			description: existingMovement[0].description,
			category: {
				type: existingMovement[0].categoryType as CategoryType,
				id: existingMovement[0].categoryId,
				subId: existingMovement[0].categorySubId,
			},
			wallet: {
				originId: existingMovement[0].summary[0].originWalletId,
				destinationId: existingMovement[0].summary[0].destinationWalletId,
			},
		}

		return output
	})
