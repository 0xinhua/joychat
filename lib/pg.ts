import { Pool } from 'pg'

export const pgPool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_STRING,
})
