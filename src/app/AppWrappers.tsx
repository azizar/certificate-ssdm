'use client';
import React, { ReactNode } from 'react';
import 'styles/App.css';
import 'styles/Contact.css';
// import '@asseinfo/react-kanban/dist/styles.css';
// import 'styles/Plugins.css';
import 'styles/index.css';
import 'styles/MiniCalendar.css';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from 'react-query';

const _NoSSR = ({ children }: { children: ReactNode }) => (
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

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    // @ts-expect-error
    <NoSSR>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </NoSSR>
  );
}
