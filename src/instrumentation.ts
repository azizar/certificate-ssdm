// import PizZip from 'pizzip';

import prisma from './lib/prisma';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { Worker } = await import('bullmq');
    const { connection } = await import('./lib/redis');
    const { readFileSync } = await import('fs');
    const { mkdirSync, writeFileSync, existsSync } = await import('fs');
    const { resolve, join } = await import('path');

    const libre = require('libreoffice-convert');
    libre.convertAsync = require('util').promisify(libre.convert);

    // const { LibreOfficeFileConverter } = await import(
    //   'libreoffice-file-converter'
    // );

    const transformTemplateCertificate = async (
      eventId: string,
      person: Record<string, any>,
    ) => {
      const event = await prisma.event.findFirstOrThrow({
        where: { id: +eventId },
      });

      const definedPath = resolve(
        join(process.cwd(), 'uploads', event.qr_code),
      );

      console.log({ definedPath });

      const filename =
        'template_' + event.qr_code + '.' + event.template_file.split('.')[1];

      const content = readFileSync(
        resolve(join(definedPath, filename)),
        'binary',
      );

      // Unzip the content of the file
      // @ts-ignore
      const zip = new PizZip(content);

      // This will parse the template, and will throw an error if the template is
      // invalid, for example, if the template is "{user" (no closing tag)
      // @ts-ignore
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
      doc.render({
        person: person.name,
      });

      // Get the zip document and generate it as a nodebuffer
      const buf = doc.getZip().generate({
        type: 'nodebuffer',
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: 'DEFLATE',
      });

      const resultPath = join(definedPath, 'results');

      mkdirSync(resultPath, { recursive: true });

      const resultDocx = resolve(
        resultPath,
        person.name.replaceAll(' ', '_') + '.docx',
      );

      const resultPDf = resolve(
        resultPath,
        person.name.replaceAll(' ', '_') + '.pdf',
      );

      console.log({ resultDocx });

      writeFileSync(resultDocx, buf);

      const pdfBuf = await libre.convertAsync(buf, '.pdf', undefined);

      writeFileSync(resultDocx, buf);

      writeFileSync(resultPDf, pdfBuf);

      const existPdf = existsSync(resultPDf);

      console.log({ existPdf });

      console.log({
        from: 'delivered@resend.dev',
        to: 'aziez1996@gmail.com',
        subject: `Certificate File CertGen App.`,
        html: '<p>Thanks for the payment</p>',
        attachments: [
          {
            data: pdfBuf,
            filename: person.name.replaceAll(' ', '_') + '.pdf',
          },
        ],
      });

      return true;
    };

    new Worker(
      'GenerateQueue',
      async (job) => {
        // Job processing logic with Puppeteer goes here

        console.log({ job });

        if (job.data) {
          const { event, person } = job.data;
          await transformTemplateCertificate(event.id, person);
          // generate(job.data.template_file, job.data.qr_code);
        }
      },
      {
        connection,
        concurrency: 10,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 5000 },
      },
    );
  }
};
