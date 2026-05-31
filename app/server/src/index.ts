import { app } from './app';
import { prisma } from './config/db';
import { env } from './config/env';
import { startReminderJob } from './jobs/reminder.job';

const bootstrap = async () => {
  await prisma.$connect();
  app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
  startReminderJob();
};

bootstrap().catch(async (error) => {
  console.error('Failed to start server', error);
  await prisma.$disconnect();
  process.exit(1);
});
