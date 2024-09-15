import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { auth } from '../../../../../auth';

export const GET = auth(async (req) => {
  try {
    const limit = +req.nextUrl.searchParams.get('limit') || 10;
    const page = +req.nextUrl.searchParams.get('page') || 1;
    const q = req.nextUrl.searchParams.get('q') || '';

    const search = { name: { search: q } };

    const total = await prisma.person.count();
    const data = await prisma.person.findMany({
      where: q ? search : {},
      take: +limit,
      skip: +limit * (+page - 1),
    });

    return NextResponse.json({ data, limit, page, total });
  } catch (e) {
    console.log(e);
    throw e;
  }
});
