import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { certificateListPerson } from '../../../actions/certificate';

export async function GET() {
  const session = await auth();

  const person = await prisma.person.findFirst({
    where: { email: session.user.email },
  });

  const certificates = await prisma.certificate.findMany({
    where: { personId: person.id },
    include: {
      event: {
        select: { id: true, name: true },
      },
    },
  });

  return NextResponse.json({ data: certificates });
}
