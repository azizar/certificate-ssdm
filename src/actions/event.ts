'use server';
import { mkdir, mkdirSync, readFileSync, writeFile, writeFileSync } from 'fs';
import { Event, EventRegister, EventSchema } from 'lib/schema/event';
import { join, resolve } from 'path';
import { generateRandomString } from 'utils';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

import prisma from 'lib/prisma';

import { LibreOfficeFileConverter } from 'libreoffice-file-converter';
import { eachDayOfInterval } from 'date-fns';

import lodash from 'lodash';
import { GenerateQueue } from '../lib/queue';
import { auth } from '../auth';

export const createEvent = async (formData: FormData) => {
  const rawFormData = Object.fromEntries(formData);

  const parsed = EventSchema.safeParse(rawFormData);

  try {
    if (parsed.success) {
      const body = parsed.data;

      let filename = '';
      const code = generateRandomString(10);

      if (formData.get('cert_template') !== 'undefined') {
        const file = formData.get('cert_template') as File;
        const arrayBuffer = await file.arrayBuffer();

        const buffer = new Uint8Array(arrayBuffer);

        const definedPath = resolve(join(process.cwd(), 'uploads', code));

        const createdDir = await mkdirSync(definedPath, { recursive: true });

        console.log({ createdDir });

        filename = 'template_' + code + '.' + file.name.split('.')[1];

        const resPath = join(definedPath, filename);

        const createdFile = await writeFileSync(resPath, buffer);

        console.log({ createdFile });
      }

      return prisma.event.create({
        data: {
          name: body.name,
          end_date: body.end_date,
          start_date: body.start_date,
          person_responsibility: body.person_responsibility,
          qr_code: code,
          qr_url: code,
          template_file: filename,
          google_docs_id: body.google_docs_id,
        },
      });
    } else {
      throw parsed.error;
    }
  } catch (error) {
    console.log({ error });
    throw Error(error?.message || 'Terjadi Kesalahan Server.');
  }
};

export const updateEvent = async (eventId: number, formData: FormData) => {
  const event = await prisma.event.findFirstOrThrow({
    where: { id: +eventId },
  });

  const rawFormData = Object.fromEntries(formData) as unknown as Event;

  let filename = event.template_file;

  if (formData.get('cert_template') !== 'undefined') {
    const file = formData.get('cert_template') as File;
    const arrayBuffer = await file.arrayBuffer();

    const buffer = new Uint8Array(arrayBuffer);

    const definedPath = resolve(join(process.cwd(), 'uploads', event.qr_code));

    mkdirSync(definedPath, { recursive: true });

    filename = 'template_' + event.qr_code + '.' + file.name.split('.')[1];

    const resPath = join(definedPath, filename);

    writeFileSync(resPath, buffer);
  }

  return prisma.event.update({
    where: { id: +rawFormData.id },
    data: {
      name: rawFormData.name,
      end_date: new Date(rawFormData.end_date),
      start_date: new Date(rawFormData.start_date),
      person_responsibility: rawFormData.person_responsibility,
      template_file: filename,
      google_docs_id: rawFormData.google_docs_id,
    },
  });
};

export const getEventList = async () => {
  try {
    return prisma.event.findMany();
  } catch (error) {
    throw error;
  }
};

export const getEventDetail = async (id: number, page = 1, limit = 10) => {
  try {
    console.time('event detail with absence');
    const event = await prisma.event.findFirstOrThrow({
      where: { id },
      include: {
        certificates: true,
        person_absences: {
          include: { person: true },
          orderBy: { personId: 'asc' },
        },
      },
    });

    const absences = lodash.uniqBy([...event.person_absences], 'personId');

    const dayInterval = eachDayOfInterval({
      start: event.start_date,
      end: event.end_date,
    });

    const formated = await Promise.all(
      absences.map(async (absence) => {
        const data = [];

        const person = absence.person;

        const absenceDate = event.person_absences.filter(
          (val) =>
            val.eventId === absence.eventId && val.personId === person.id,
        );

        dayInterval.map((interval, i) => {
          let isValid = false;
          const currentAbs = absenceDate.find(
            (val) => val.absenceDate.toDateString() === interval.toDateString(),
          );
          if (currentAbs) isValid = true;
          data.push({
            day: i + 1,
            date: interval.toDateString(),
            valid: isValid,
            absenceDate: currentAbs?.absenceDate ?? null,
          });
        });

        delete absence.absenceDate;
        delete absence.id;

        return { id: absence.personId, ...absence, absences: data };
      }),
    );

    console.timeEnd('event detail with absence');

    return { ...event, person_absences: formated };
  } catch (error) {
    throw error;
  }
};

export const getEventByCode = async (code: string) => {
  try {
    return prisma.event.findFirstOrThrow({
      where: { qr_code: code },
      select: {
        name: true,
        person_responsibility: true,
        start_date: true,
        end_date: true,
      },
    });
  } catch (error) {
    throw Error('Error occured.');
  }
};

export const personRegisterEvent = async (
  code: string,
  payload: EventRegister,
) => {
  try {
    const event = await prisma.event.findFirstOrThrow({
      where: { qr_code: code },
      include: { certificates: true },
    });

    const session = await auth();

    const user = await prisma.user.findFirstOrThrow({
      where: { email: session.user.email },
    });

    const person = await prisma.person.upsert({
      where: { identifier: payload.identifier },
      update: {
        name: payload.full_name,
        identifier: payload.identifier,
        title: payload.title,
        email: payload.email,
      },
      create: {
        name: payload.full_name,
        identifier: payload.identifier,
        title: payload.title,
        email: payload.email,
        userId: user.id
      },
    });

    return await prisma.eventPersonAbsence.create({
      data: {
        eventId: event.id,
        personId: person.id,
        absenceDate: new Date(),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const generateCertificate = async (eventId, personId) => {
  try {
    const [event, person] = await Promise.all([
      await prisma.event.findFirst({ where: { id: eventId } }),
      await prisma.person.findFirst({ where: { id: personId } }),
    ]);

    await GenerateQueue.add('generate', { event, person });

    return 'OK';
  } catch (e) {
    throw e;
  }
};
