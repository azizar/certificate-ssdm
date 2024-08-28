import { Worker, Queue } from 'bullmq';
import Redis from 'ioredis';
import ProceedConvertDocs from '../lib/convert-and-send';
import { Event, Person } from '.prisma/client';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,

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
      console.log("Certificate Already Exists");
      return;
    }

    const processor = new ProceedConvertDocs(event, person);

    const response = await processor.convertAndSavePdf();

    const certificate = await prisma.certificate.create({
      data: {
        eventId: event.id,
        personId: person.id,
        cert_url: response.split('/').slice(6, 9).join('/'),
        status: 'SUCCESS',
      },
    });

    console.log({ certificate });
  },
  {
    connection,
    concurrency: 5,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
);

export default worker;
