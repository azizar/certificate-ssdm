import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'node:fs';
import { auth } from '../../../../../../auth';

import prisma from '../../../../../../lib/prisma';

export const GET = auth(async (req) => {
  const location = path.resolve(path.join(process.cwd(), 'data_absensi.json'));

  const data = fs.readFileSync(location, 'utf8');

  const parsed = JSON.parse(data);

  console.log('Total Data:', parsed?.data?.length);

  const results = [];
  const errors = [];

  for (const payload of parsed.data) {
    try {
      const pers = await prisma.person.upsert({
        where: { email: payload.email, identifier: payload.email },
        update: {
          name: payload.full_name,
        },
        create: {
          name: `${payload?.pangkat} ${payload.full_name}`,
          identifier: payload.email,
          title: '',
          email: payload.email,
        },
      });
      results.push({id: pers.id, name: pers.name});
    } catch (error) {
      console.log(error, payload.full_name);
      errors.push(payload)
      continue;
    }
    // const upsert = await prisma.person.upsert({
    //   where: { email: person.email },
    //   create: {
    //     email: person.email,
    //     name: `${person.pangkat} ${person.full_name}`,
    //     title: '',
    //     identifier: person.email,
    //   },
    //   update: {
    //     name: `${person.pangkat} ${person.full_name}`,
    //     title: '',
    //   },
    // });
    //
    // results.push({
    //   email: person.email,
    //   name: `${person.pangkat} ${person.full_name}`,
    //   title: '',
    //   identifier: person.email,
    // });
  }

  // const resultBulk = await prisma.person.createManyAndReturn({
  //   data: results,
  //   skipDuplicates: true
  // })

  console.log('Inserted', results.length);
  console.log("Error:", errors.length);

  return NextResponse.json({ results });
});
