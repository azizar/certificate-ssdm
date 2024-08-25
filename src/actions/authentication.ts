'use server';

import { signIn, signOut } from 'auth';
import { AuthError } from 'next-auth';

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  errors?: any;
  success: boolean;
  callback?: string;
};

export const handleLogin = async (prevState: FormState, formData: FormData) => {
  console.log('form:', Object.fromEntries(formData));
  try {
    await signIn('google', formData);
  } catch (error) {
    console.log('message:', error?.message);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError':
          return {
            message: error.cause?.err?.message ?? 'Failed to authenticated.',
          };
        case 'CredentialsSignin':
          return {
            message:
              'Kredensial yang anda masukan salah ! Mohon periksa kembali.',
          };
        default:
          return {
            message: 'Terjadi kesalahan pada sistem !',
          };
      }
    }
    throw error;
  }
};

export const handleSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.log({ error });
  }
};
