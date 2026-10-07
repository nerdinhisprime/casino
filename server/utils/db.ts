import { Pool } from 'pg';

const {
  DB_USR,
  DB_PSWD,
  DB_HOST = 'postgres',
  DB_PORT = 5432,
  DB_NAME,
} = process.env;

export const db = new Pool({
  connectionString: `postgres://${DB_USR}:${DB_PSWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
})
