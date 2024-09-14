'use client';
import React, { useCallback } from 'react';

import { Alert, Button, Typography } from '@material-tailwind/react';
import { FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { Event } from '.prisma/client';

const GenerateCertificate = ({ event }: { event: Event }) => {
  const [loading, setLoading] = React.useState(false);

  const handleGenerateCertificate = () => {
    setLoading(!loading);
    axios
      .post('/api/admin/certificate/generate-bulk', {
        eventId: event.id,
      })
      .then((res) => {
        console.log(res);
      })
      .catch()
      .finally(() => setLoading(false));
  };
  return (
    <div className={'h-full place-content-center space-y-4 text-center'}>
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
      {event['certificates']?.length > 0 && (
        <Alert>Total Certificate of this event : 50</Alert>
      )}
      <Button disabled={loading} onClick={handleGenerateCertificate}>
        Generate Certificate
      </Button>
    </div>
  );
};

export default GenerateCertificate;
