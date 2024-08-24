import { NextResponse } from 'next/server';
import ProceedConvertDocs from '../../../../../../lib/convert-and-send';

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } },
) {
  const body = await request.json();
  console.log({ body });

  const personId = body.personId;
  const event = await prisma.event.findFirstOrThrow({
    where: { id: +params.eventId },
    include: {
      person_absences: {
        distinct:'id',
        where: { personId: +personId },
        take: 1,
      },
    },
  });

  console.log({ event });
  //
  // const processor = new ProceedConvertDocs(event);
  //
  // const result = await processor.proceed();

  // await convertAndSendEmail();

  return NextResponse.json({ message: 'OK' });
}
