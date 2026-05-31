import { env } from './config/env.js';
import { createApp } from './app.js';
import { startReminderWorker } from './services/reminder-worker.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Todo API listening on port ${env.PORT}`);
  startReminderWorker();
});
