import { ReactNode } from 'react';
import PersonLayout from './ProfileLayout';

export default function Layout({ children }: { children: ReactNode }) {
  return <PersonLayout>{children}</PersonLayout>;
}
