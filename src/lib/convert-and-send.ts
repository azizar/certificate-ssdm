import { Event } from 'lib/schema/event';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import * as process from 'node:process';
import { join } from 'path';

export default class ProceedConvertDocs {
  event: Event;

  constructor(event: Event) {
    this.event = event;
  }

  public async proceed() {
    const auth = await this.authenticate();
    return await this.convertAndSendEmail(auth);
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

  private async convertAndSendEmail(auth) {
    const drive = google.drive({ version: 'v3', auth });

    const driveId = '1_ip5ZS0AoYoMukSc_U-RTkqJm3m6OASy167wOcOvXFo';

    //2. Copy docs
    const response = await drive.files.copy({
      fileId: driveId,
      auth,
    });

    if (response.status === 200) {
      const nameForNewFile = 'DEV_TEST_' + Date.now();
      const newFileId = response.data.id;

      if (nameForNewFile) {
        try {
          await drive.files.update({
            fileId: newFileId,
            requestBody: {
              name: nameForNewFile,
            },
          });

          const finds = ['<1>', '<2>'];
          const replaces = ['Mutiara', 'Faradilla SP'];

          await this.findAndReplaceTextInDoc(auth, newFileId, finds, replaces);

          const resultExport = await drive.files.export(
            {
              fileId: newFileId,
              mimeType: 'application/pdf',
            },
            { responseType: 'stream' },
          );

          return this.sendEmail(nameForNewFile + '.pdf', resultExport.data);
        } catch (err) {
          console.log('Error processing: ', err);
        }
      }
    } else {
      return response.data;
    }
  }

  private async sendEmail(filename: string, content: any) {
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
      to: 'aziez1996@gmail.com',
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
