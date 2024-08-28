'use client';
import AdminCertificateTable from 'components/admin/data-tables/AdminCertificateTable';
import { Event, Person } from '.prisma/client';


export type CertificateTableRow = {
  id: number;
  cert_url: string;
  event: Event;
  person: Person;
};


const Certificate = () => {
  return <AdminCertificateTable />;
};

export default Certificate;
