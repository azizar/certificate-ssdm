import React from 'react';
import ProfileOverview from './ProfilePerson';
import { auth } from '../../../auth';
import { SetupPersonProfile } from './SetupPersonProfile';

const MyComponent = async () => {
  const session = await auth();

  // const person = await prisma.person.findFirst({
  //   where: { email: session.user.email },
  // });
  //
  // console.log({ person });
  //
  // if (!person) return <SetupPersonProfile session={session} />;

  return <ProfileOverview />;
};

export default MyComponent;
