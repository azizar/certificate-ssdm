import { NextResponse } from 'next/server';
import GoogleApis from '../../../../../../../lib/googleapis';
import prisma from '../../../../../../../lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } },
) {
  const body = await request.json();

  const personId = body.personId;
  const event = await prisma.event.findFirstOrThrow({
    where: { id: +params.eventId },
    include: {
      person_absences: {
        distinct: 'id',
        where: { personId: +personId },
        take: 1,
      },
    },
  });

  //
  // const processor = new GoogleApis(event);
  //
  // const result = await processor.proceed();

  // await convertAndSendEmail();

  return NextResponse.json({ message: 'OK' });
}
