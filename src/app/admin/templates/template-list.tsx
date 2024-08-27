'use client';

import React, { useEffect } from 'react';

import { Button, Card, CardBody, CardFooter } from '@material-tailwind/react';
import { BiCopy } from 'react-icons/bi';

export interface DriveFile {
  mimeType: string;
  thumbnailLink: string;
  id: string;
  name: string;
}

const GoogleTemplateList = ({ files }: { files: DriveFile[] }) => {
  return (
    <div className={'mt-4 grid grid-cols-4 space-x-2 space-y-2'}>
      {files.length >= 1 &&
        files.map((file) => (
          <Card key={file.id}>
            <CardBody className={'max-w-full text-wrap'}>
              <div className={'size-[120px]'}>
                <img src={file.thumbnailLink} alt={file.name} />
              </div>
              <div>{file.name}</div>
              <div>{file.mimeType}</div>
              <a className={'text-wrap'} href={'/admin/templates/' + file.id}>
                Detail
              </a>
            </CardBody>
            <CardFooter>
              <Button>
                <BiCopy />
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
};

export default GoogleTemplateList;
