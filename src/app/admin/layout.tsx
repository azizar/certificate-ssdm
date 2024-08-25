import React, { ReactNode } from 'react';
import Admin from './admin-layout';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import process from 'node:process';
import { Typography } from '@material-tailwind/react';

interface Props {
  children: ReactNode;
}

async function AdminLayout(props: Props) {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const admins = process.env.ADMIN_EMAILS.split(',');

  if (session.user && admins.includes(session.user.email)) {
    return <Admin>{props.children}</Admin>;
  }

  redirect('/')
}

export default AdminLayout;
