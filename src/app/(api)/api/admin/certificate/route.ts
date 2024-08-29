import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const event = +req.nextUrl.searchParams.get('event');
    const person = +req.nextUrl.searchParams.get('person');

    const certificates = await prisma.certificate.findMany({
      where: {
        personId: person ? person : undefined,
        eventId: event ? event : undefined,
      },
      include: { person: true, event: true },
    });
    return NextResponse.json(certificates);
  } catch (e) {
    throw e;
  }
}
