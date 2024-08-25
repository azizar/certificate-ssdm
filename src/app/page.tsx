'use server';
import { auth } from 'auth';
import { redirect } from 'next/navigation';
import * as process from 'node:process';

export default async function Home({}) {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const admins = process.env.ADMIN_EMAILS.split(',')

  console.log(admins.includes(session.user.email));

  if (session.user && admins.includes(session.user.email)) {
    redirect('/admin/default');
  } else {
    redirect('/profile');
  }
}
