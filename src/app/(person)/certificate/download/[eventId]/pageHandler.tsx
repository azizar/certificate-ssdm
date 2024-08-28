'use client';
import React, { useEffect } from 'react';

const PageHandler = () => {
  useEffect(() => {
    console.log(process.cwd());
  }, []);
  return <div></div>;
};

export default PageHandler;
