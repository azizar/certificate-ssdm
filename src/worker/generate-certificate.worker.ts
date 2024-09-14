import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import GoogleApis from '../lib/googleapis';
import { Event, Person } from '.prisma/client';
import process from 'node:process';
import prisma from '../lib/prisma';
import { GoogleApi } from '../lib/googleapi';

export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  password: process.env.REDIS_PASSWORD,
  username: 'default',
});

const queueName = 'GenerateCertificate';

export const generateCertQueue = new Queue(queueName, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 60000,
    },
  },
});

const worker = new Worker(
  queueName, // this is the queue name, the first string parameter we provided for Queue()
  async (job) => {
    const data = job?.data;

    const status = await job.getState();

    await prisma.bullQueue.upsert({
      where: {
        id: job.id,
      },
      create: {
        id: job.id,
        data: JSON.stringify({ job }),
        status: status.toString(),
      },
      update: {
        data: JSON.stringify({ job }),
        status: status.toString(),
        updatedAt: new Date(),
      },
    });

    // await job.updateProgress({message:"event saved to database"})

    const event: Event = data.event;
    const person: Person = data.person;
    const forceCreate = data.force_create || false;

    const check = await prisma.certificate.findFirst({
      where: { eventId: event.id, personId: person.id },
    });

    await job.updateProgress(10);

    if (check && !forceCreate) {
      await job.log('Certificate Already Exists');
      await job.updateProgress(100);
      return check.cert_url;
    }
    await job.updateProgress(20);

    const processor = new GoogleApis(event, person);

    try {
      await job.updateProgress(30);
      const resultConvert = await processor.convertAndSavePdf();
      await job.updateProgress(40);

      const checkCertificate = await prisma.certificate.findFirst({
        where: {
          eventId: event.id,
          personId: person.id,
        },
      });

      await job.updateProgress(50);

      await job.log('Check Certificate');

      if (!checkCertificate) {
        await job.log('Certificate not found !');
        //Create
        await prisma.certificate.create({
          data: {
            eventId: event.id,
            personId: person.id,
            cert_url: resultConvert.filePath,
            status: 'SUCCESS',
            drive_url: '',
            drive_file: '',
          },
        });
        await job.updateProgress(60);
      } else {
        await job.log('Certificate found ! ID: ' + checkCertificate.id);
        await prisma.certificate.update({
          where: { id: checkCertificate.id },
          data: {
            cert_url: resultConvert.filePath,
            status: 'SUCCESS',
            drive_url: '',
            drive_file: '',
          },
        });
        await job.updateProgress(60);
      }

      await job.updateProgress(70);

      if (resultConvert.file.id) {
        await job.log('Deleting file on Drive');
        const googleService = new GoogleApi();
        const responseDelete = await googleService.driveService().files.delete({
          fileId: resultConvert.file.id,
        });

        await job.log(
          'Deleting file on Drive. Status : ' + responseDelete.status,
        );
      }

      await job.updateProgress(100);

      return resultConvert;
    } catch (e) {
      throw e;
    }
  },
  {
    connection,
    concurrency: 10,
    removeOnComplete: { age: 10000 },
  },
);

worker.on('ready', async () => {
  console.log('Worker ready...');
});

// worker.on('progress', (job, progress) => {
//   console.log(`Worker progress: ${progress} Job ID: ${job.id}`);
// });

// worker.on('active', (job, prev) => {
//   console.log(`Worker Active ! Prev: ${prev} Job ID: ${job.id}`);
// });
//
// worker.on('stalled', (jobId, prev) => {
//   console.log(`Workers stalled id:${jobId}, prev: ${prev}`);
// });

// worker.on('completed', (job) => {
//   console.log(`Job ID:${job.id} has completed!`, {
//     job: JSON.stringify(job.returnvalue),
//   });
// });

worker.on('failed', (job, err) => {
  console.log(`Job ID:${job.id} has failed with ${err.message}`);
});

export default worker;
