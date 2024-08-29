import AdminCertificateTable from 'components/admin/data-tables/AdminCertificateTable';
import { Event, Person } from '.prisma/client';
import { certificateList } from '../../../actions/certificate';
import { Suspense } from 'react';

export type CertificateTableRow = {
  id: number;
  cert_url: string;
  event: Event;
  person: Person;
};

export default async function Certificate() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCertificateTable />
    </Suspense>
  );
}
