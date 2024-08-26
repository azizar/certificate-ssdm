import { Event } from 'lib/schema/event';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import * as process from 'node:process';
import { join } from 'path';
import { Person } from '.prisma/client';

export default class ProceedConvertDocs {
  event: Event;
  person: Person;

  constructor(event: Event, person: Person) {
    this.event = event;
    this.person = person;
  }

  public async proceed() {
    const auth = await this.authenticate();
    return this.convertAndSendEmail(auth);
  }

  public async convertAndStreamPdf(){
    const auth = await this.authenticate();
    return this.convertAndSendEmail(auth, true);
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
      ],
    });
  }

  private async convertAndSendEmail(auth, streamToPdf=false) {
    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });

    const docsId = this.event.google_docs_id;

    //TODO: Check if docs by filename exist, then return

    const selectedDocs = await docs.documents.get({documentId:docsId})

    const response = await drive.files.copy({
      fileId: selectedDocs.data.documentId,
      auth,
    });

    if (response.status === 200) {
      const fileName = this.person.name + this.event.qr_code;
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

          if (streamToPdf){
            return drive.files.export(
              {
                fileId: fileId,
                mimeType: 'application/pdf',
              },
              { responseType: 'arraybuffer' },
            )
          }

          const resultExport = await drive.files.export(
            {
              fileId: fileId,
              mimeType: 'application/pdf',
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
