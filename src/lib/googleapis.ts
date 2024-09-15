import { Event } from 'lib/schema/event';
import { google, Common } from 'googleapis';
import nodemailer from 'nodemailer';
import * as process from 'node:process';
import { join, resolve } from 'path';
import { Person } from '.prisma/client';
import { mkdirSync, createWriteStream, existsSync, unlinkSync } from 'fs';
import { GaxiosError } from 'googleapis-common';

export default class GoogleApis {
  event: Event;
  person: Person;

  constructor(event?: Event, person?: Person) {
    this.event = event;
    this.person = person;
  }

  public async proceed() {
    const auth = await this.authenticate();
    return this.convertAndSendEmail(auth);
  }

  public async getAuth() {
    return await this.authenticate();
  }

  public async getDriveFolders() {
    const auth = await this.authenticate();

    const drive = google.drive({ version: 'v3', auth });

    return drive.files.list({});
  }

  public async driveInstance() {
    const auth = await this.authenticate();

    return google.drive({ version: 'v3', auth });
  }

  public async presentationInstance() {
    const auth = await this.authenticate();

    return google.slides({ version: 'v1', auth });
  }

  public async convertAndSaveImage(): Promise<Record<string, any>> {
    const auth = await this.authenticate();

    const drive = google.drive({ version: 'v3', auth });

    const docsId = this.event.google_docs_id;

    try {
      const selectedFile = await drive.files.get({ fileId: docsId });

      const responseCopy = await drive.files.copy({
        fileId: selectedFile.data.id,
        auth,
      });

      const fileId = responseCopy.data.id;

      const fileName =
        this.person.email + '_' + this.event.qr_code + '_' + Date.now();

      const updateFile = await drive.files.update({
        fileId: fileId,
        requestBody: {
          name: fileName,
        },
      });

      console.log('updated:', updateFile.data);

      const finds = '{person}';
      const replaces = this.person.name;

      if (
        updateFile.data.mimeType === 'application/vnd.google-apps.presentation'
      ) {
        await this.findAndReplaceTextInSlides(
          auth,
          updateFile.data.id,
          finds,
          replaces,
        );
      } else {
        await this.findAndReplaceTextInDoc(
          auth,
          updateFile.data.id,
          finds,
          replaces,
        );
      }

      const slides = google.slides({ version: 'v1', auth });

      const pres = await slides.presentations.get({
        presentationId: updateFile.data.id,
      });

      console.log(pres);

      const response = await drive.files.export(
        {
          fileId,
          mimeType: 'application/json',
          alt: 'media',
        },
        { responseType: 'stream' },
      );

      const destPath = join(process.cwd(), 'certificates', this.event.qr_code);

      if (!existsSync(destPath)) {
        await mkdirSync(resolve(destPath), { recursive: true });
      }

      const ext = '.jpg';

      const filePath = destPath.toString() + '/' + fileName + ext;

      if (!existsSync(filePath)) {
        unlinkSync(filePath);
      }

      const dest = createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        response.data.on('error', reject).pipe(dest).on('finish', resolve);
      });

      return { filePath };
    } catch (e) {
      console.log('Error processing: ', e);
    }
  }

  public async deleteFile(fileId: string) {
    const auth = await this.authenticate();

    const drive = google.drive({ version: 'v3', auth });

    return drive.files.delete({ fileId });
  }

  public async convertAndSavePdf(): Promise<Record<string, any>> {
    const auth = await this.authenticate();

    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });

    const docsId = this.event.google_docs_id;

    //TODO: Check if docs by filename exist, then return

    const selectedDocs = await docs.documents.get({ documentId: docsId });

    const resultCopy = await drive.files.copy({
      fileId: selectedDocs.data.documentId,
      auth,
    });
    const fileId = resultCopy.data.id;

    try {
      const fileName = this.person.name + '_' + this.event.qr_code;

      const responseUpdateName = await drive.files.update({
        fileId: fileId,
        requestBody: {
          name: fileName,
        },
      });

      const finds = '{person}';
      const replaces = this.person.name;

      await this.findAndReplaceTextInDoc(auth, fileId, finds, replaces);

      const response = await drive.files.export(
        {
          fileId: fileId,
          mimeType: 'application/pdf',
        },
        { responseType: 'stream' },
      );

      const destPath = join(process.cwd(), 'certificates', this.event.qr_code);
      const relativePath = join('certificates', this.event.qr_code);

      if (!existsSync(destPath)) {
        await mkdirSync(resolve(destPath), { recursive: true });
      }

      const ext = '.pdf';

      const filePath = destPath.toString() + '/' + fileName + ext;

      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      const dest = createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        response.data
          .on('error', reject)
          .pipe(dest)
          .on('error', reject)
          .on('finish', resolve);
      });

      return {
        filePath: join(relativePath, `${fileName + ext}`),
        file: responseUpdateName.data,
      };
    } catch (err) {
      if ((err as GaxiosError).response) {
        const error = err as Common.GaxiosError;
        console.error(error.response);
        throw error;
      }

      console.log('Unknown Error : ', err);
    }
  }

  private async authenticate() {
    return google.auth.getClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      keyFile: process.cwd() + '/google-creds.json',
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
        'https://www.googleapis.com/auth/presentations',
      ],
    });
  }

  private async convertAndSendEmail(auth, streamToPdf = false) {
    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });

    const docsId = this.event.google_docs_id;

    //TODO: Check if docs by filename exist, then return

    const selectedDocs = await docs.documents.get({ documentId: docsId });

    const response = await drive.files.copy({
      fileId: selectedDocs.data.documentId,
      auth,
    });

    if (response.status === 200) {
      const fileName = this.person.id + '_' + this.event.qr_code;
      const fileId = response.data.id;

      if (fileName) {
        try {
          await drive.files.update({
            fileId: fileId,
            requestBody: {
              name: fileName,
            },
          });

          const finds = '{person}';
          const replaces = this.person.name;

          await this.findAndReplaceTextInDoc(auth, fileId, finds, replaces);

          if (streamToPdf) {
            return drive.files.export(
              {
                fileId: fileId,
                mimeType: 'application/pdf',
              },
              { responseType: 'blob' },
            );
          }

          const resultExport = await drive.files.export(
            {
              fileId: fileId,
              mimeType: 'application/pdf',
              alt: 'media',
            },
            { responseType: 'stream' },
          );

          return this.sendEmail(
            this.person.email,
            fileName + '.pdf',
            resultExport.data,
          );
        } catch (err) {
          console.log('Error processing: ', err);
        }
      }
    } else {
      return response.data;
    }
  }

  private async sendEmail(email: string, filename: string, content: any) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      secure: true,
      port: 465,
      auth: {
        user: 'resend',
        pass: 're_PJojzNFd_PD8hTCHtFF9Vf3JavzHn4WKD',
      },
    });

    const info = await transporter.sendMail({
      from: 'delivered@resend.dev',
      to: email,
      subject: 'Certificate',
      html: '<strong>It works!</strong>',
      attachments: [{ filename, content }],
    });

    return info;
  }

  private async findAndReplaceTextInSlides(
    auth,
    documentId: string,
    find: string | string[],
    replace: string | string[],
  ) {
    let finds = Array.isArray(find) ? find : [find];
    let replaces = Array.isArray(replace) ? replace : [replace];

    try {
      const docs = google.slides('v1');

      let requests = [];

      for (let i = 0; i < finds.length; i++) {
        requests.push({
          replaceAllText: {
            containsText: {
              text: finds[i],
              matchCase: true,
            },
            replaceText: replaces[i],
          },
        });
      }

      return docs.presentations.batchUpdate({
        auth: auth,
        presentationId: documentId,
        requestBody: {
          requests: requests,
        },
      });
    } catch (err) {
      console.log('Error Batch Update', err);
    }
  }

  private async findAndReplaceTextInDoc(
    auth,
    documentId: string,
    find: string | string[],
    replace: string | string[],
  ) {
    let finds = Array.isArray(find) ? find : [find];
    let replaces = Array.isArray(replace) ? replace : [replace];

    try {
      const docs = google.docs({ version: 'v1', auth });

      let requests = [];

      for (let i = 0; i < finds.length; i++) {
        requests.push({
          replaceAllText: {
            containsText: {
              text: finds[i],
              matchCase: true,
            },
            replaceText: replaces[i],
          },
        });
      }

      return docs.documents.batchUpdate({
        documentId,
        requestBody: { requests: requests },
      });
    } catch (err) {
      console.log('Error Batch Update', err);
    }
  }
}
