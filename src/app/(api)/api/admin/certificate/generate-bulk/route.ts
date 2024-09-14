import { generateCertQueue } from '../../../../../../worker/generate-certificate.worker';
import prisma from '../../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { GoogleApi } from '../../../../../../lib/googleapi';
import { BulkJobOptions } from 'bullmq';
import { auth } from '../../../../../../auth';
import { checkAdmin } from '../../../../../../lib/check-admin';

export const POST = auth(async function (req) {
  console.time('Generate Bulk');
  const admin = await checkAdmin(req.auth);
  if (req.auth && admin) {
    try {
      const body = await req.json();
      const event = await prisma.event.findFirstOrThrow({
        where: { id: +body.eventId },
        // include: {
        //   person_absences: {
        //     distinct: 'personId',
        //     include: { person: true },
        //     select: { personId: true },
        //   },
        // },
      });

      const persons = await prisma.person.findMany({
        take: 3000,
        orderBy: { id: 'desc' },
      });

      const payload = [];

      //Test Purpose
      for (const person of persons) {
        const opts: BulkJobOptions = {
          delay: 1000,
          removeOnComplete: true,
          removeOnFail: false,
          jobId: `${event.qr_code}-${person.id}`,
        };

        const queue = {
          name: 'Generating Certificate ' + event.name + ' to: ' + person.name,
          data: { event, person, force_create: false },
          opts,
        };

        payload.push(queue);
      }

      // for (const data of event.person_absences) {
      //   const opts: BulkJobOptions = {
      //     delay: 0,
      //   };
      //
      //   const person = data.person;
      //
      //   const queue = {
      //     name: 'Generating Certificate ' + event.name + ' to: ' + person.name,
      //     data: { event, person, force_create: true },
      //     opts,
      //   };
      //
      //   payload.push(queue);
      // }

      await generateCertQueue.addBulk(payload);
      // await new Promise((resolve) => {
      //   setTimeout(resolve, 5000);
      // });

      console.timeEnd('Generate Bulk');

      return NextResponse.json({
        message: `Bulk generate certificate of event: ${event.name}. Total person : ${persons.length}`,
        payload,
      });
    } catch (e) {
      NextResponse.json({ message: 'Request Failed.' }, { status: 400 });
    }
  }

  return NextResponse.json({ message: 'Unauthorized.' }, { status: 403 });
});

// export const GET = async (
//   request: Request,
//   { params }: { params: { eventId: string } },
// ) => {};
