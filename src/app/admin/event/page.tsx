import AdminEvent from './admin-event';
import { Suspense } from 'react';
import { getEventList } from '../../../actions/event';

async function Event() {
  const events = await getEventList();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminEvent events={events}/>
    </Suspense>
  );
}

export default Event;
