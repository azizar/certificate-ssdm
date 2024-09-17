import { getEventByCode } from 'actions/event';
import { EventRegisterForm } from './event-register';
import { getSession } from 'next-auth/react';
import { auth } from 'auth';

async function EventRegisterPage({ params }: { params: { code: string } }) {
  const { code } = params;

  try {
    const eventDetail = await getEventByCode(code);
    const session = await auth();

    if (eventDetail && session)
      return <EventRegisterForm event={eventDetail} session={session} />;
  } catch (error) {
    return <p>Event Not Found !</p>;
  }
}

export default EventRegisterPage;
