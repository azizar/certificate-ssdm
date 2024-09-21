import React, { ReactNode } from 'react';
import AppWrappers from './AppWrappers';
import { ToastProvider } from '@radix-ui/react-toast';
// import '@asseinfo/react-kanban/dist/styles.css';
// import '/public/styles/Plugins.css';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="shortcut icon"
        type="image/x-icon"
        href={process.env.NEXT_PUBLIC_BASE_PATH || '' + '/favicon.ico'}
      />

      <title>SDM Polri Certificate Generator </title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <body id={'root'}>
        <AppWrappers>
          {children}
        </AppWrappers>
      </body>
    </html>
  );
}
