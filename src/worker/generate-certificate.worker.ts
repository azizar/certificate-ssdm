import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import ProceedConvertDocs from '../lib/convert-and-send';
import { Event, Person } from '.prisma/client';
import process from 'node:process';
import prisma from '../lib/prisma';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  password: process.env.REDIS_PASSWORD,
  username: 'default',
});

export const generateCertQueue = new Queue('generateCertQueue', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

const worker = new Worker(
  'generateCertQueue', // this is the queue name, the first string parameter we provided for Queue()
  async (job) => {
    const data = job?.data;

    const event: Event = data.event;
    const person: Person = data.person;

    console.log(
      'Generating Certificate to : ' + person.name + ', Event: ' + event.name,
    );

    const check = await prisma.certificate.findFirst({
      where: { eventId: event.id, personId: person.id },
    });

    if (check) {
      throw new Error('Certificate Already Exists');
    }

    const processor = new ProceedConvertDocs(event, person);

    try {
      const response = await processor.convertAndSavePdf();

      console.log('Convert Response:', response);

      const certificate = await prisma.certificate.create({
        data: {
          eventId: event.id,
          personId: person.id,
          cert_url: response,
          status: 'SUCCESS',
        },
      });

      console.log('Certificate:', certificate);

      return certificate;
    } catch (e) {
      throw e;
    }
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
);

worker.on('completed', (job) => {
  console.log(`Job ID:${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ID:${job.id} has failed with ${err.message}`);
  console.error(err);
});

export default worker;
