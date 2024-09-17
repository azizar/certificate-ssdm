import { auth } from '../../../../auth';
import prisma from '../../../../lib/prisma';
import { result } from 'lodash';
import { NextResponse } from 'next/server';

export const GET = auth(async (req) => {
  const totalPerson = await prisma.person.count();
  const totalCertificate = await prisma.certificate.count();
  const totalEvent = await prisma.event.count();

  return NextResponse.json({ totalPerson, totalCertificate, totalEvent });
});
