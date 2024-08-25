'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { Button, Spinner } from '@material-tailwind/react';
import { FaDownload } from 'react-icons/fa';
import { method } from 'lodash';
import { body } from '@material-tailwind/react/theme/base/typography';
import { testGenerate } from '../actions/certificate';
import prisma from '../lib/prisma';
import ProceedConvertDocs from '../lib/convert-and-send';
import { FiLoader } from 'react-icons/fi';

interface IDownloadProgress {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  label: string;
  filename: string; //TODO: handle from content disposition header
  className?: string;
  body?: Record<string, any>;
}

function DownloadProgress(props: IDownloadProgress) {
  const { path, label, className } = props;

  const [downloading, setDownloading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  const handleDownloadAction = async () => {};

  const handleDownloadTemplate = () => {
    setDownloading(true);

    // const options: Req = {
    //   responseType: "arraybuffer",
    //   onDownloadProgress: (evt: AxiosProgressEvent) => {
    //     const totalLength = evt.total
    //     if (totalLength && totalLength > 0) {
    //       const step =
    //         parseFloat((evt.loaded / totalLength).toFixed(2)) * 100;
    //       setProgress(step);
    //     }
    //   }
    // }

    console.log(props.body);

    fetch(path, {
      method: 'POST',
      body: JSON.stringify(props.body),
    })
      .then(async (res) => {
        const blob = await res.blob();

        const filename = 'cert.pdf' || 'untitled';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        function handleDownload() {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', handleDownload);
          }, 150);
        }

        a.addEventListener('click', handleDownload, false);
        a.click();
        // if (data) {
        //   const buff = Buffer.from(data.value); // Node.js Buffer
        //   const blob = new Blob([buff]);
        //
        //   const url = URL.createObjectURL(blob);
        //   const a = document.createElement('a');
        //   a.href = url;
        //   a.download = filename;
        //
        //   function handleDownload() {
        //     setTimeout(() => {
        //       URL.revokeObjectURL(url);
        //       a.removeEventListener('click', handleDownload);
        //     }, 150);
        //   }
        //
        //   a.addEventListener('click', handleDownload, false);
        //   a.click();
        // }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => {
        setTimeout(() => {
          setProgress(0);
          setDownloading(false);
        }, 300);
      });

    // dispositionHeader
    // ?.split(";")
    // ?.find((n) => n.includes("filename="))
    // ?.replace("filename=", "")
    // .trim();

    // const contentLength = res.headers["Content-Length"];
    //
    // const totalLength =
    //     typeof contentLength === "string" && parseInt(contentLength);

    // const reader = res.data.getReader();
    // const chunks = [];
    // let receivedLength = 0;
    //
    // while (true) {
    //     const {done, value} = await reader.read();
    //     if (done) {
    //         setDownloading(false);
    //         setProgress(0);
    //         break;
    //     }
    //
    //     chunks.push(value);
    //     receivedLength += value.length;
    //
    //     if (typeof totalLength === "number") {
    //         const step =
    //             parseFloat((receivedLength / totalLength).toFixed(2)) * 100;
    //         setProgress(step);
    //     }
    // }
  };
  return (
    <Button
      className={'flex items-center gap-1 rounded-full'}
      onClick={handleDownloadTemplate}
      disabled={downloading}
      size={'sm'}
    >
      {downloading ? (
        <>
          <Spinner className={'size-3'} />
          <span>Processing</span>
        </>
      ) : (
        <>
          <FaDownload className={'size-3'} />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}

export default DownloadProgress;
