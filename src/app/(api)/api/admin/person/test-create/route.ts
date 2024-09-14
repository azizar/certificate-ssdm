import { auth } from 'auth';
import { NextResponse } from 'next/server';
import { Person } from '.prisma/client';
import prisma from '../../../../../../lib/prisma';

export const GET = auth(async (req, res) => {
  const payload = [];
  for (let i = 1; i <= 20000; i++) {
    const counter = i.toString().padStart(5, '0')
    const person = {
      name: `Person Test ${counter}`,
      identifier: `person${counter}@test.dev`,
      email: `person${counter}@test.dev`,
      title: 'S.Dev',
    };
    payload.push(person);
  }

  // await prisma.person.createMany({
  //   data: payload,
  // });
  return NextResponse.json({ payload });
});
