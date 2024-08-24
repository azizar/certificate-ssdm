import { auth } from 'auth';
import { redirect } from 'next/navigation';
import SignInDefault from './LoginForm';

async function SigninPage() {
  const session = await auth();

  if (session) {
    redirect('/admin/default');
  }

  return <SignInDefault />;
}

export default SigninPage;
