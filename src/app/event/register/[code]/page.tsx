import { getEventByCode } from 'actions/event';
import EventRegister from './event-register';

async function EventRegisterPage({ params }: { params: { code: string } }) {
  const { code } = params;

  try {
    const eventDetail = await getEventByCode(code);

    return <EventRegister event={eventDetail} />;
  } catch (error) {
    return <p>Event Not Found !</p>;
  }
}

export default EventRegisterPage;
