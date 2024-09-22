'use client';
import React, { useState } from 'react';

import type { Event } from '.prisma/client';
import {
  Alert,
  Button,
  Card,
  Input,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { FiLoader } from 'react-icons/fi';

const BulkAbsence = ({ event }: { event: Event }) => {
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = useState<File>();
  const [absenceDate, setAbsenceDate] = useState<Date>();
  const [formState, setFormState] = useState('');

  console.log({ file, absenceDate });

  const handleGenerateCertificate = () => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('event', `${event.id}`);
    formData.append('absenceDate', absenceDate.toString());

    setLoading(!loading);

    axios
      .post('/api/admin/event/bulk-absence', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(percentCompleted);
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch()
      .finally(() => setLoading(false));
  };
  return (
    <Card className={'h-full place-content-center space-y-4 p-6'}>
      <Typography className="font-medium">Bulk Absence {event.name}</Typography>
      {/*<pre>*/}
      {/*  {JSON.stringify(event, null, 2)}*/}
      {/*</pre>*/}
      {loading && (
        <>
          <FiLoader className="mx-auto size-12 animate-spin" />
          <Typography className={'mx-auto'}>
            Generating Certificate {event.name} ...
          </Typography>
        </>
      )}
      {/*<Alert>*/}
      {/*  <ol>*/}
      {/*    <li>Extension allowed : .json</li>*/}
      {/*    <li>Contain List: Person Data (full_name, email, pangkat)</li>*/}
      {/*  </ol>*/}
      {/*</Alert>*/}
      <Input
        label="Absence Date"
        crossOrigin={undefined}
        type={'datetime-local'}
        onChange={(event) => {
          setAbsenceDate(new Date(event.target.value));
        }}
      />
      <Input
        label="File"
        crossOrigin={undefined}
        type={'file'}
        onChange={(event) => {
          setFile(event.target.files[0]);
        }}
      />
      <div className="gap-2 md:flex">
        <Button disabled={loading} onClick={handleGenerateCertificate}>
          Upload
        </Button>
        <Button disabled={loading} onClick={handleGenerateCertificate}>
          Download Template
        </Button>
      </div>
    </Card>
  );
};

export default BulkAbsence;
