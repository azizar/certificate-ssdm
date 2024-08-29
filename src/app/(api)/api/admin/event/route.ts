'use server';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {

  try {
    const event = await prisma.event.findMany();

    return NextResponse.json(event);
  } catch (e) {
    throw e;
  }
}
