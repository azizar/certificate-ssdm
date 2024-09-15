import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { certificateList } from '../../../../../actions/certificate';

export async function GET(req: NextRequest) {
  try {
    const event = +req.nextUrl.searchParams.get('event') || '';
    const person = +req.nextUrl.searchParams.get('person');
    const limit = +req.nextUrl.searchParams.get('limit') || 10;
    const page = +req.nextUrl.searchParams.get('page') || 1;

    const data = await prisma.certificate.findMany({
      take: +limit,
      skip: +limit * (+page - 1),
      include: { Person: true, Event: true },
    });

    const total = await prisma.certificate.count();

    return NextResponse.json({ data, limit, page, total });
  } catch (e) {
    throw e;
  }
}
