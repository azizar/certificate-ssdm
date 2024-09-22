import { getEventDetail } from 'actions/event';
import BulkAbsence from '../components/bulk-add-absence';

export default async function AddBulkAbsence({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventDetail(+params.id, 1, 10);
  if (event) {
    return <BulkAbsence event={event} />;
  }
}
