import { eq } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { AuthorizationMiddleware } from './session-validate'

import { DeleteMovementSchema } from '@/core/dto'

import { db, schema } from '@/database/utils'

export const deleteMovement = createServerFn({ method: 'POST' })
	.middleware([AuthorizationMiddleware])
	.inputValidator(DeleteMovementSchema)
	.handler(async ({ data, context: { userId, logger } }) => {
		// Checks movement exists
		const existingMovement = await db
			.select({ id: schema.Movements.id, userId: schema.Movements.userId })
			.from(schema.Movements)
			.where(eq(schema.Movements.id, data.id))

		if (existingMovement.length === 0) throw new Response('Movement not found', { status: 404 })
		if (existingMovement[0].userId !== userId) throw new Response('Unauthorized', { status: 403 })

		logger.info(`User: ${userId} trying to remove movement: ${data.id}`)

		await db.transaction(async tx => {
			await tx.delete(schema.MovementSummary).where(eq(schema.MovementSummary.movementId, data.id))
			await tx.delete(schema.Movements).where(eq(schema.Movements.id, data.id))
		})
	})
