import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATA_FILE_PATH: process.env.LOCAL_STORAGE_FILE
    ? path.resolve(process.cwd(), process.env.LOCAL_STORAGE_FILE)
    : path.resolve(process.cwd(), 'server/data/ritmo-store.json')
};
