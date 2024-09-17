import { auth } from '../../../../../auth';
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export const POST = auth(async (req) => {
  try {
    const body = await req.json();

    const payload = body;
    const currentUser = req.auth.user;

    const event = await prisma.event.findFirst({
      where: { qr_code: payload.event.qr_code },
    });

    const user = await prisma.user.findFirstOrThrow({
      where: { email: currentUser.email },
    });

    const person = await prisma.person.upsert({
      where: { email: payload.email },
      update: {
        name: payload.full_name,
        title: payload.title,
      },
      create: {
        name: payload.full_name,
        identifier: payload.identifier,
        title: payload.title,
        email: payload.email,
      },
    });

    const today = new Date();

    const existing = await prisma.eventPersonAbsence.findFirst({
      where: {
        AND: [
          { personId: person.id },
          { eventId: event.id },
          {
            absenceDate: {
              gte: new Date(today.setHours(0, 0, 0, 0)),
              lt: new Date(today.setHours(23, 59, 59, 999)),
            },
          },
        ],
      },
    });

    if (existing)
      return NextResponse.json({ message: 'Update', data: existing });

    const data = await prisma.eventPersonAbsence.create({
      data: {
        eventId: event.id,
        personId: person.id,
        absenceDate: new Date(),
      },
    });

    return NextResponse.json({ message: 'Create', data });
  } catch (error) {
    return NextResponse.json({ message: 'Error', error }, { status: 400 });
  }
});
