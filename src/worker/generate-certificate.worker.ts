import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import GoogleApis from '../lib/googleapis';
import { Event, Person } from '.prisma/client';
import prisma from '../lib/prisma';
import { eventTypeCheckCompleted } from 'next/dist/telemetry/events';

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
    try {
      const data = job?.data;
      const event: Event = data.event;
      const person: Person = data.person;

      if (person.id && event.id) {
        const status = await job.getState();

        const bullq = await prisma.bullQueue.create({
          data: {
            data: JSON.stringify({ job }),
            status: status.toString(),
            person_id: +person.id,
            event_id: +event.id,
          },
        });

        await job.log('BullQ ID: ' + bullq.id || 'error');

        // await job.updateProgress({message:"event saved to database"})

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

        await job.updateProgress(30);
        const resultConvert = await processor.convertAndSavePdf();
        await job.updateProgress(40);

        // const checkCertificate = await prisma.certificate.findFirst({
        //   where: {
        //     eventId: event.id,
        //     personId: person.id,
        //   },
        // });

        await job.updateProgress(50);
        //Create

        await job.updateProgress(60);

        // if (!checkCertificate) {
        //
        // } else {
        //
        //   await job.log('Certificate found ! ID: ' + checkCertificate.id);
        //
        //   await prisma.certificate.update({
        //     where: { id: checkCertificate.id },
        //     data: {
        //       cert_url: resultConvert.filePath,
        //       status: 'SUCCESS',
        //       drive_url: '',
        //       drive_file: '',
        //     },
        //   });
        //   await job.updateProgress(60);
        // }

        await job.updateProgress(70);

        await job.log('Deleting file on Drive');

        // const googleService = new GoogleApi();
        // const responseDelete = await googleService.driveService().files.delete({
        //   fileId: resultConvert.file.id,
        // });

        const responseDelete = await processor.deleteFile(
          resultConvert.file.id,
        );

        await job.log(
          'Deleting file on Drive. Status : ' + responseDelete.status,
        );

        try {
          const currentCert = await prisma.certificate.findFirst({
            where: {
              eventId: +job.data.event.id,
              personId: +job.data.person.id,
            },
          });

          const cert = await prisma.certificate.upsert({
            where: {
              id: currentCert.id,
            },
            create: {
              eventId: +job.data.event.id,
              personId: +job.data.person.id,
              cert_url: resultConvert.filePath ?? 'error',
              status: 'SUCCESS',
              drive_url: '',
              drive_file: '',
            },
            update: {
              cert_url: resultConvert.filePath ?? 'error',
              status: 'SUCCESS' + '_UPDATED at ' + Date.now() + '',
              drive_url: '',
              drive_file: '',
            },
          });

          console.log('JOB : ' + job.id + 'CertID: ' + cert.id);

          await job.log('Cert Created with ID: ' + cert.id);
        } catch (e) {
          throw e;
        }

        await job.updateProgress(100);

        return { resultConvert, bullq };
      }
    } catch (e) {
      throw e;
    }
  },
  {
    connection,
    concurrency: 1,
    removeOnComplete: { count: 10000 },
  },
);

// worker.on('ready', async () => {
//   console.log('Worker ready...');
// });

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

worker.on('completed', async (job) => {
  if (job?.returnvalue?.bullq?.id) {
    const update = await prisma.bullQueue.update({
      where: { id: job.returnvalue.bullq.id },
      data: {
        status: await job.getState(),
        updatedAt: new Date(),
      },
    });
    await job.log('DB Queue ID:' + update?.id);
  }

  // const cert = await prisma.certificate.create({
  //   data: {
  //     eventId: job.data.event.id,
  //     personId: job.data.person.id,
  //     cert_url: job.returnvalue.filePath ?? 'error',
  //     status: 'SUCCESS',
  //     drive_url: '',
  //     drive_file: '',
  //   },
  // });
  //
  // await job.log('Cert ID:' + cert?.id);

  await job.updateProgress(100);
});

worker.on('failed', async (job, err) => {
  console.log(`Job ID:${job.id} has failed with ${err.message}`);
  await prisma.bullQueue.update({
    where: { id: job.returnvalue.bullq.id },
    data: {
      status: await job.getState(),
      updatedAt: new Date(),
    },
  });
});

export default worker;
