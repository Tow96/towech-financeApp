import { createServerOnlyFn } from '@tanstack/react-start'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })

const getDb = createServerOnlyFn(() => {
	return drizzle(pool, { schema })
})

export const db = getDb()
