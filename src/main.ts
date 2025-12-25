import { app } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function bootstrap() {
  console.log('BOOT: starting...');
  await connectDB();
  console.log('BOOT: db connected');  

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

bootstrap();
