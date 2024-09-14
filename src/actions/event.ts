'use server';
import { mkdirSync, writeFileSync } from 'fs';
import { Event, EventRegister, EventSchema } from 'lib/schema/event';
import { join, resolve } from 'path';
import { generateRandomString } from 'utils';

import prisma from 'lib/prisma';

import { eachDayOfInterval } from 'date-fns';

import lodash from 'lodash';
import { auth, signOut } from '../auth';

import { generateCertQueue } from '../worker/generate-certificate.worker';

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

export const getEventDetail = async (
  id: number,
  page: number,
  limit: number,
) => {
  if (page <= 1) page = 1;
  try {
    const event = await prisma.event.findFirstOrThrow({
      where: { id },
      include: {
        person_absences: {
          include: { person: true },
          orderBy: { personId: 'asc' },
          distinct: 'personId',
          take: limit,
          skip: limit * (page - 1),
        },
      },
    });

    const totalUniquePersonAbsence = await prisma.eventPersonAbsence.findMany({
      where: { eventId: event.id },
      select: { eventId: true, personId: true, id: true },
      distinct: 'personId',
    });

    // const absences = lodash.uniqBy([...event.person_absences], 'personId');
    const absences = event.person_absences;

    const dayInterval = eachDayOfInterval({
      start: event.start_date,
      end: event.end_date,
    });

    const formated = await Promise.all(
      absences.map(async (absence) => {
        const data = [];

        const person = absence.person;

        // const absenceDate = event.person_absences.filter(
        //   (val) =>
        //     val.eventId === absence.eventId && val.personId === person.id,
        // );

        const absenceDate = await prisma.eventPersonAbsence.findMany({
          where: {
            personId: absence.personId,
            eventId: absence.eventId,
          },
        });

        dayInterval.map((interval, i) => {
          let isValid = false;
          const currentAbs = absenceDate.find(
            (val) => val.absenceDate.toDateString() === interval.toDateString(),
          );
          if (currentAbs) isValid = true;
          data.push({
            day: i + 1,
            date: interval.toLocaleDateString(),
            valid: isValid,
            absenceDate: currentAbs?.absenceDate ?? null,
          });
        });

        delete absence.absenceDate;
        delete absence.id;

        return { id: absence.personId, ...absence, absences: data };
      }),
    );

    return {
      ...event,
      person_absences: formated,
      totalPage: Math.ceil(totalUniquePersonAbsence.length / limit),
      page,
      limit,
    };
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
        qr_code: true,
      },
    });
  } catch (error) {
    throw Error('Error occured.');
  }
};

export const personRegisterEvent = async (
  payload: EventRegister & { event: Event },
) => {
  try {
    const session = await auth();

    if (!session) await signOut();

    const event = await prisma.event.findFirst({
      where: { qr_code: payload.event.qr_code },
    });

    const user = await prisma.user.findFirstOrThrow({
      where: { email: session.user.email },
    });

    const person = await prisma.person.upsert({
      where: { email: payload.email },
      update: {
        name: payload.full_name,
        title: payload.title,
      },
      create: {
        name: payload.full_name,
        identifier: payload.identifier,
        title: payload.title,
        email: payload.email,
      },
    });

    const today = new Date();

    const existing = await prisma.eventPersonAbsence.findFirst({
      where: {
        AND: [
          { personId: person.id },
          { eventId: event.id },
          {
            absenceDate: {
              gte: new Date(today.setHours(0, 0, 0, 0)),
              lt: new Date(today.setHours(23, 59, 59, 999)),
            },
          },
        ],
      },
    });

    console.log({ existing });

    if (existing) throw new Error('Anda telah absen untuk hari ini.');

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

export const generateCertificate = async (
  eventId: number,
  personId: number,
) => {
  try {
    const event = await prisma.event.findFirstOrThrow({
      where: { id: eventId },
      include: {
        person_absences: {
          where: { personId: personId },
          include: { person: true },
          take: 1,
        },
        certificates: {
          where: {
            AND: [{ personId: personId }, { eventId: eventId }],
          },
          take: 1,
        },
      },
    });

    const person = event?.person_absences[0]?.person;

    if (!person) {
      throw new Error('Person not found.');
    }

    await generateCertQueue.add(
      'Generating Certificate of Event ' + event.name,
      { event, person },
      { priority: 1, delay: 1000 },
    );

    /**
     * TODO:
     * 1. Check certificate file, if false add queue generate certificate
     * 2. Optional send email
     */

    return event;
  } catch (e) {
    throw e;
  }
};
