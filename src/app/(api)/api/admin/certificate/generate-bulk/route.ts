import { generateCertQueue } from '../../../../../../worker/generate-certificate.worker';
import prisma from '../../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { GoogleApi } from '../../../../../../lib/googleapi';
import { BulkJobOptions } from 'bullmq';
import { auth } from '../../../../../../auth';
import { checkAdmin } from '../../../../../../lib/check-admin';

export const POST = auth(async function (req) {
  const admin = await checkAdmin(req.auth);

  if (!req.auth || !admin) {
    throw new Error('Unauthorized');
  }

  const body = await req.json();

  const event = await prisma.event.findFirstOrThrow({
    where: { id: +body.eventId },
    include: {
      person_absences: {
        distinct: 'personId',
        include: { person: true },
      },
    },
  });

  const payload = [];

  const persons = event.person_absences;

  for (const data of persons) {
    const person = data.person;

    const opts: BulkJobOptions = {
      delay: 1000,
      removeOnFail: false,
      jobId: `${event.qr_code}-${person.id}`,
    };

    const queue = {
      name: 'Generating Certificate ' + event.name + ' to: ' + person.name,
      data: {
        event: { ...event, person_absences: undefined },
        person,
        force_create: true,
      },
      opts,
    };

    payload.push(queue);
  }

  await generateCertQueue.addBulk(payload);

  return NextResponse.json({
    message: `Bulk generate certificate of event: ${event.name}. Total person : ${persons.length}`,
  });
});
