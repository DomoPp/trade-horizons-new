import { createPool, Pool } from 'mysql2/promise';

export const DATABASE_POOL = 'DATABASE_POOL';

export const databaseProvider = {
  provide: DATABASE_POOL,
  useFactory: async (): Promise<Pool> => {
    const pool = createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'trade_horizons',
      port: Number(process.env.DB_PORT || 3306),
      connectionLimit: 10,
    });
    return pool;
  },
};
