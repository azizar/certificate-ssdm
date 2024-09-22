import { Session } from '@auth/core/types';
import process from 'node:process';
import { redirect } from 'next/navigation';

export const checkAdmin = async (session: Session) => {
  const admins = process.env.ADMIN_EMAILS.split(',');
  if (session.user && admins.includes(session.user.email)) {
    return true;
  }

  return false;
};
