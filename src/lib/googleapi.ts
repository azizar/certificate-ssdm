import {
  google, // The top level object used to access services
  drive_v3, // For every service client, there is an exported namespace
  Auth, // Namespace for auth related types
  Common,
  slides_v1, docs_v1, // General types used throughout the library
} from 'googleapis';
import { GaxiosError } from 'googleapis-common';
import * as path from 'node:path';

export class GoogleApi {
  private auth: Auth.GoogleAuth;

  constructor() {
    const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-creds.json'),
      scopes: [
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations',
      ],
    });
    this.auth = auth;
  }

  public driveService() {
    const drive: drive_v3.Drive = google.drive({
      version: 'v3',
      auth: this.auth,
    });
    return drive;
  }

  public slideService() {
    const slide: slides_v1.Slides = google.slides({
      version: 'v1',
      auth: this.auth,
    });
    return slide;
  }

  public documentService() {
    const docs: docs_v1.Docs = google.docs({
      version: 'v1',
      auth: this.auth,
    });
    return docs;
  }
}
