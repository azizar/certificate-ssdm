import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const limit = +req.nextUrl.searchParams.get('limit') || 10;
    const page = +req.nextUrl.searchParams.get('page') || 1;
    const q = req.nextUrl.searchParams.get('q') || undefined;

    const search = { name: { search: q } };

    const total = await prisma.person.count();
    const data = await prisma.person.findMany({
      where: q ? search : {},
      take: +limit,
      skip: +limit * (+page - 1),
    });

    return NextResponse.json({ data, limit, page, total });
  } catch (e) {
    throw e;
  }
}
