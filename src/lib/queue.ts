import { Queue } from 'bullmq';
import { connection } from './redis';

export const GenerateQueue = new Queue('GenerateQueue', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});
