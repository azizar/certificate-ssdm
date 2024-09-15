import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { auth } from '../../../../../../auth';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import { redirect } from 'next/navigation';

export const GET = async (
  req: Request,
  { params }: { params: { eventId: string } },
) => {
  const session = await auth();

  if (!session) redirect('/login');

  const person = await prisma.person.findFirst({
    where: { email: session.user.email },
  });

  if (!person) {
    return NextResponse.json({ data: [] });
  }

  const certificates = await prisma.certificate.findFirstOrThrow({
    where: { personId: person.id, eventId: +params.eventId },
  });

  const filenameArr = certificates.cert_url.split('/');
  const filename = filenameArr[filenameArr.length - 1];

  const buffer = await fs.readFile(
    path.resolve(path.join(certificates.cert_url)),
  );
  const headers = new Headers();
  // remember to change the filename `test.pdf` to whatever you want the downloaded file called
  headers.append('Content-Disposition', `attachment; filename=${filename}`);
  headers.append('Content-Type', 'application/pdf');

  return new Response(buffer, {
    headers,
  });
};
