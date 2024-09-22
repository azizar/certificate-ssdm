import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { auth } from '../../../../../../auth';

import prisma from '../../../../../../lib/prisma';
import { Person } from '.prisma/client';
import { checkAdmin } from '../../../../../../lib/check-admin';

export const POST = auth(async (req) => {
  const admin = await checkAdmin(req.auth);

  try {
    if (!admin) throw new Error('Permission denied.');

    const formData = await req.formData();

    const file = formData.get('file') as File;

    const buffer = Buffer.from(await file.arrayBuffer());

    const event = await prisma.event.findFirstOrThrow({
      where: { id: +formData.get('event') },
    });

    const absenceDate = new Date(formData.get('absenceDate') as string);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log('Total Rows: ', jsonData.length);

    const results = await processImportAbsence(jsonData, event.id, absenceDate);

    console.log('Result Persons: ', results.personIds.length);

    const deleted = await prisma.eventPersonAbsence.deleteMany({
      where: {
        AND: [
          { eventId: event.id },
          { personId: { in: results.personIds } },
          { absenceDate: { gte: new Date(absenceDate.setHours(0, 0, 0)) } },
          { absenceDate: { lte: new Date(absenceDate.setHours(23, 59, 59)) } },
        ],
      },
    });
    //
    console.log('Deleted :', deleted.count);

    const bulkAbsence = await prisma.eventPersonAbsence.createManyAndReturn({
      skipDuplicates: true,
      data: results.bulkPayload,
    });

    console.log('Total Bulk : ', bulkAbsence.length);

    return NextResponse.json({ event, results: { ...results, bulkAbsence } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  //   const json = new TextDecoder('utf-8').decode(buffer);

  //   console.log(json);

  //   const location = path.resolve(path.join(process.cwd(), 'data_absensi.json'));

  //   const parsed = JSON.parse(data);

  //   console.log('Total Data:', parsed?.data?.length);

  //   const results = [];
  //   const errors = [];

  //   for (const payload of parsed.data) {
  //     try {
  //       const pers = await prisma.person.upsert({
  //         where: { email: payload.email, identifier: payload.email },
  //         update: {
  //           name: payload.full_name,
  //         },
  //         create: {
  //           name: `${payload?.pangkat} ${payload.full_name}`,
  //           identifier: payload.email,
  //           title: '',
  //           email: payload.email,
  //         },
  //       });
  //       results.push({ id: pers.id, name: pers.name });
  //     } catch (error) {
  //       console.log(error, payload.full_name);
  //       errors.push(payload);
  //       // biome-ignore lint/correctness/noUnnecessaryContinue: <explanation>
  //       continue;
  //     }
  //     // const upsert = await prisma.person.upsert({
  //     //   where: { email: person.email },
  //     //   create: {
  //     //     email: person.email,
  //     //     name: `${person.pangkat} ${person.full_name}`,
  //     //     title: '',
  //     //     identifier: person.email,
  //     //   },
  //     //   update: {
  //     //     name: `${person.pangkat} ${person.full_name}`,
  //     //     title: '',
  //     //   },
  //     // });
  //     //
  //     // results.push({
  //     //   email: person.email,
  //     //   name: `${person.pangkat} ${person.full_name}`,
  //     //   title: '',
  //     //   identifier: person.email,
  //     // });
  //   }

  //   // const resultBulk = await prisma.person.createManyAndReturn({
  //   //   data: results,
  //   //   skipDuplicates: true
  //   // })

  //   console.log('Inserted', results.length);
  //   console.log('Error:', errors.length);
});

const processImportAbsence = async (
  persons: Record<string, any>[],
  eventId: number,
  absenceDate: Date,
) => {
  const results = [];
  const errors = [];
  const bulkPayload = [];
  const personIds=[]
  for (const payload of persons) {
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
      results.push({ id: pers.id, name: pers.name });
      bulkPayload.push({ personId: pers.id, eventId, absenceDate });
      personIds.push(pers.id);
    } catch (error) {
      console.log(error, payload.full_name);
      errors.push(payload);
      // biome-ignore lint/correctness/noUnnecessaryContinue: <explanation>
      continue;
    }
  }

  return { results, bulkPayload, errors, personIds };
};
