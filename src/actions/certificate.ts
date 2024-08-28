'use server';

import { google } from 'googleapis';
import process from 'node:process';
import prisma from '../lib/prisma';
import ProceedConvertDocs from '../lib/convert-and-send';
import { auth } from '../auth';
import { Simulate } from 'react-dom/test-utils';
import wheel = Simulate.wheel;

export const certificateList = async () => {
  return prisma.certificate.findMany();
};

export const certificateListPerson = async (email: string) => {
  const person = await prisma.person.findFirst({
    where: { email: email },
  });

  console.log(person);

  return prisma.certificate.findMany({
    where: { personId: person.id },
    include: { person: true, event: true },
  });
};

export const testGenerate = async (eventId: string, personId) => {
  const event = await prisma.event.findFirstOrThrow({
    where: { id: +eventId },
  });

  const person = await prisma.person.findFirstOrThrow({ where: { id: 1 } });

  const processor = new ProceedConvertDocs(event, person);

  return processor.proceed();
};

export const templateLists = async () => {
  const auth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFile: process.cwd() + '/google-creds.json',
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
  });

  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.list({
    pageSize: 5,
    fields: '*',
  });

  return response;
};

export const getDetailTemplate = async (fileId: string) => {
  const auth = await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFile: process.cwd() + '/google-creds.json',
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly',
    ],
  });

  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.get({
    fileId,
    fields: '*',
  });

  return response;
};
