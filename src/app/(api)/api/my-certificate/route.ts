import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';

import prisma from '../../../../lib/prisma';

export async function GET() {
  const session = await auth();

  const person = await prisma.person.findFirst({
    where: { email: session.user.email },
  });



  if (!person) {
    return NextResponse.json({ data: [] });
  }

  const certificates = await prisma.certificate.findMany({
    where: { personId: person.id },
    include: {
      Event: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json({ data: certificates });
}
