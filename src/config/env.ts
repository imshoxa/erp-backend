import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  MONGO_URI: process.env.MONGO_URI ?? '',
};

if (!env.MONGO_URI) {
  throw new Error('MONGO_URI is required');
}
