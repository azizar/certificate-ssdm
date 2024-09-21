'use client';
import React, { type ReactNode } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/App.css';
import 'styles/Contact.css';

// import '@asseinfo/react-kanban/dist/styles.css';
// import 'styles/Plugins.css';
import 'styles/index.css';
import 'styles/MiniCalendar.css';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from 'react-query';

const _NoSSR = ({ children }: { children: ReactNode }) => (
  // biome-ignore lint/complexity/noUselessFragments: <explanation>
  <React.Fragment>{children}</React.Fragment>
);

const NoSSR = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

import { ThemeProvider } from '@material-tailwind/react';
import { ToastContainer } from 'react-toastify';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    // @ts-expect-error
    <NoSSR>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastContainer />
        </QueryClientProvider>
      </ThemeProvider>
    </NoSSR>
  );
}
