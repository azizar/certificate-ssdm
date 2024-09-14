import React, { Suspense } from 'react';
import prisma from '../../../../../lib/prisma';
import GoogleApis from '../../../../../lib/googleapis';
import { auth } from '../../../../../auth';
import PageHandler from './pageHandler';
import { Event } from '.prisma/client';
import { redirect } from 'next/navigation';

const DownloadCertificatePage = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  const eventId = +params.eventId;
  const session = await auth();

  const event = await prisma.event.findFirstOrThrow({ where: { id: eventId } });
  const person = await prisma.person.findFirstOrThrow({
    where: { email: session.user.email },
  });

  if (!event || !person) return <div>Error Event / Person Not Found.</div>;

  const processor = new GoogleApis(event, person);

  const response = await processor.convertAndSavePdf();

  console.log({ response });





  // const url = URL.createObjectURL(blobdata);

  return (
    <Suspense fallback={<p>Loading</p>}>
      <PageHandler   />
    </Suspense>
  );
};

export default DownloadCertificatePage;
