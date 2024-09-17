import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { auth } from '../../../../../auth';
import * as fs from 'fs/promises';
import * as path from 'node:path';
import { redirect } from 'next/navigation';
import { existsSync } from 'fs';

import { fromPath } from 'pdf2pic';
import process from 'node:process';

const convertToJpg = async (filename: string, filePath: string) => {
  const convert = fromPath(filePath, {
    density: 300,
    saveFilename: filename ?? Date.now() + '',
    savePath: path.join(process.cwd(), 'certificate-images'),
    format: 'png',
    preserveAspectRatio: true,
  });
  const pageToConvertAsImage = 1;

  return convert(pageToConvertAsImage, { responseType: 'image' });
};

export const POST = auth(async (req) => {
  try {
    const body = await req.json();

    const eventId = +body.eventId;

    const person = await prisma.person.findFirst({
      where: {
        email: req.auth.user.email,
      },
    });

    if (
      !person ||
      !(await prisma.event.findFirst({ where: { id: eventId } }))
    ) {
      return NextResponse.json(
        { message: 'No such event found.' },
        { status: 400 },
      );
    }

    const certificates = await prisma.certificate.findFirstOrThrow({
      where: { personId: person.id, eventId },
    });

    // console.log('cwd:' + process.cwd());
    // console.log('path:' + path.join(process.cwd(), certificates.cert_url));

    const filenameArr = certificates.cert_url.split('/');
    const filename = filenameArr[filenameArr.length - 1];

    // const imageFilename = filename.replace('.pdf', '.jpg');
    //
    // const checkFileImage = existsSync(
    //   path.resolve(path.join(process.cwd(), certificates.cert_url)),
    // );
    //
    // if (!checkFileImage) {
    //   const data = await convertToJpg(
    //     imageFilename,
    //     path.resolve(path.join(process.cwd(), certificates.cert_url)),
    //   );
    //
    //   console.log(data);
    // }
    //
    // console.log({ checkFileImage });
    //
    // try {
    //   const checkFile = await fs.readFile(
    //     certificates.cert_url.replace('.pdf', '.jpg'),
    //   );
    // } catch (e) {}

    const buffer = await fs.readFile(
      path.resolve(path.join(certificates.cert_url)),
    );

    const headers = new Headers();
    // remember to change the filename `test.pdf` to whatever you want the downloaded file called
    headers.append('Content-Disposition', `attachment; filename=${filename}`);
    headers.append('Content-Type', 'application/pdf');

    return new Response(buffer, {
      headers,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e.message ?? 'Unknown error', stack: JSON.stringify(e) },
      { status: 500 },
    );
  }
});
