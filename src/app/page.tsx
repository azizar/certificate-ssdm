'use server';
import { auth } from 'auth';
import { redirect } from 'next/navigation';

export default async function Home({}) {
  const session = await auth();

  console.log(session.user.admin);

  if (!session) {
    redirect('/api/auth/signin');
  }

  if (session.user.admin) {
    redirect('/admin/default');
  } else {
    redirect('/profile');
  }
}
